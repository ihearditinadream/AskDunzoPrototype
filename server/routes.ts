import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertFeatureRequestSchema, 
  insertWebSquareFeatureSchema,
  insertWebSquareRatingSchema,
  type User 
} from "@shared/schema";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config, validateConfig } from "./config";
import { rateLimit, validateBody } from "./middleware";

// Initialize Stripe (will be configured with secret key later)
const stripe = config.stripe.secretKey 
  ? new Stripe(config.stripe.secretKey, { apiVersion: "2025-06-30.basil" })
  : null;

// Initialize Gemini AI
const genAI = config.ai.geminiApiKey
  ? new GoogleGenerativeAI(config.ai.geminiApiKey)
  : null;

// Helper to get current user
async function getCurrentUser(req: Request): Promise<User | null> {
  const userSession = req.user as any;
  if (!userSession?.claims?.sub) return null;
  return await storage.getUser(userSession.claims.sub) || null;
}

// Feature request limits by tier
const FEATURE_LIMITS = {
  free: 3,
  premium: Infinity,
  lifetime: Infinity,
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // ==================== Authentication Routes ====================
  
  // Get current user profile
  app.get('/api/auth/user', async (req: Request, res: Response) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ==================== User & Dashboard Routes ====================
  
  // Get user profile (v1 API)
  app.get('/api/v1/users/me', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Update user profile
  app.put('/api/v1/users/me', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { firstName, lastName } = req.body;
      const updatedUser = await storage.upsertUser({
        id: user.id,
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
      });
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // ==================== Phone Verification Routes ====================
  
  // Verify phone number (for referral program)
  app.post('/api/v1/auth/verify-phone', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { phoneNumber } = req.body;
      if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number required" });
      }
      
      // Update user's phone number
      const updatedUser = await storage.updateUserPhone(user.id, phoneNumber);
      
      // Check and confirm any pending referrals
      const confirmedReferral = await storage.confirmReferral(user.id);
      
      res.json({ 
        message: "Phone number verified", 
        user: updatedUser,
        referralConfirmed: !!confirmedReferral 
      });
    } catch (error) {
      console.error("Error verifying phone:", error);
      res.status(500).json({ message: "Failed to verify phone number" });
    }
  });

  // ==================== Subscription & Payment Routes ====================
  
  // Create Stripe checkout session
  app.post('/api/v1/subscriptions/create-checkout-session', 
    isAuthenticated, 
    rateLimit(5, 60000), // 5 requests per minute
    async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(503).json({ message: "Payment service not configured" });
      }
      
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { plan } = req.body; // 'premium' or 'lifetime'
      if (!['premium', 'lifetime'].includes(plan)) {
        return res.status(400).json({ message: "Invalid plan" });
      }
      
      // Create or retrieve Stripe customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email || undefined,
          metadata: { userId: user.id },
        });
        customerId = customer.id;
        await storage.updateUserSubscription(user.id, { stripeCustomerId: customerId });
      }
      
      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: plan === 'lifetime' 
          ? [{
              price_data: {
                currency: 'usd',
                product_data: {
                  name: 'AskDunzo Lifetime Premium',
                  description: 'One-time payment for lifetime access',
                },
                unit_amount: 20000, // $200
              },
              quantity: 1,
            }]
          : [{
              price: config.stripe.premiumPriceId || '', // Monthly subscription price ID
              quantity: 1,
            }],
        mode: plan === 'lifetime' ? 'payment' : 'subscription',
        success_url: `${config.app.domain}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.app.domain}/pricing`,
        metadata: {
          userId: user.id,
          plan,
        },
      });
      
      res.json({ sessionUrl: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ message: "Failed to create checkout session" });
    }
  });

  // Stripe webhook handler
  app.post('/api/v1/subscriptions/webhook', async (req: Request, res: Response) => {
    if (!stripe) {
      return res.status(503).json({ message: "Payment service not configured" });
    }
    
    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = config.stripe.webhookSecret;
    
    if (!webhookSecret) {
      console.error("Stripe webhook secret not configured");
      return res.status(500).json({ message: "Webhook not configured" });
    }
    
    try {
      const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          const userId = session.metadata?.userId;
          const plan = session.metadata?.plan;
          
          if (userId && plan) {
            if (plan === 'lifetime') {
              await storage.updateUserSubscription(userId, {
                subscriptionTier: 'lifetime',
                subscriptionExpiresAt: null,
              });
            } else if (session.subscription) {
              await storage.updateUserSubscription(userId, {
                subscriptionTier: 'premium',
                stripeSubscriptionId: session.subscription as string,
              });
            }
          }
          break;
        }
        
        case 'invoice.payment_succeeded': {
          const invoice = event.data.object as Stripe.Invoice;
          
          // For subscription renewals - currently handled automatically by Stripe
          // We can enhance this later to update subscription expiry dates
          console.log('Invoice payment succeeded:', invoice.id);
          break;
        }
        
        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          const user = await storage.getUserByEmail(subscription.customer as string);
          if (user) {
            await storage.updateUserSubscription(user.id, {
              subscriptionTier: 'free',
              stripeSubscriptionId: undefined,
              subscriptionExpiresAt: undefined,
            });
          }
          break;
        }
      }
      
      res.json({ received: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(400).json({ message: "Webhook error" });
    }
  });

  // Cancel subscription
  app.post('/api/v1/subscriptions/cancel', isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(503).json({ message: "Payment service not configured" });
      }
      
      const user = await getCurrentUser(req);
      if (!user || !user.stripeSubscriptionId) {
        return res.status(404).json({ message: "No active subscription found" });
      }
      
      await stripe.subscriptions.cancel(user.stripeSubscriptionId);
      await storage.updateUserSubscription(user.id, {
        subscriptionTier: 'free',
        stripeSubscriptionId: undefined,
        subscriptionExpiresAt: undefined,
      });
      
      res.json({ message: "Subscription cancelled" });
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      res.status(500).json({ message: "Failed to cancel subscription" });
    }
  });

  // ==================== Feature Generation Routes ====================
  
  // Submit feature request
  app.post('/api/v1/features/request', 
    isAuthenticated,
    rateLimit(10, 3600000), // 10 requests per hour
    async (req: Request, res: Response) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if premium
      if (user.subscriptionTier !== 'premium') {
        return res.status(403).json({ message: "Premium subscription required" });
      }
      
      const { websiteUrl, featureDescription, targetElement } = req.body;
      
      // Validate request
      const validationResult = insertFeatureRequestSchema.safeParse({
        userId: user.id,
        websiteUrl,
        featureDescription,
        targetElement: targetElement || null,
      });
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid request", 
          errors: validationResult.error.errors 
        });
      }
      
      // Create feature request with initial status
      const featureRequest = await storage.createFeatureRequest(validationResult.data);
      
      // Update status to processing
      await storage.updateFeatureRequestStatus(featureRequest.id, 'processing');
      
      // Generate code using Gemini
      if (genAI) {
        try {
          const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
          
          const prompt = `Generate JavaScript code for a browser extension content script that adds the following feature to a website:

Website URL: ${websiteUrl}
Feature Description: ${featureDescription}
${targetElement ? `Target Element: ${targetElement}` : ''}

Requirements:
1. The code should be self-contained and work as a content script
2. Use vanilla JavaScript (no external dependencies)
3. Include error handling
4. Make sure the code is safe and doesn't break the website
5. Add comments explaining what the code does
6. If the feature involves UI elements, make them blend with the website's design

Generate only the JavaScript code without any markdown formatting or explanations.`;
          
          const result = await model.generateContent(prompt);
          const generatedCode = result.response.text();
          
          // Update feature request with generated code
          await storage.updateFeatureRequestStatus(featureRequest.id, 'completed', generatedCode);
          
          res.json({
            ...featureRequest,
            status: 'completed',
            generatedCode,
          });
        } catch (aiError) {
          console.error("Error generating code with Gemini:", aiError);
          await storage.updateFeatureRequestStatus(featureRequest.id, 'failed');
          res.status(500).json({ message: "Failed to generate code" });
        }
      } else {
        // If no Gemini API key, return error
        await storage.updateFeatureRequestStatus(featureRequest.id, 'failed');
        res.status(503).json({ message: "AI service not configured" });
      }
    } catch (error) {
      console.error("Error creating feature request:", error);
      res.status(500).json({ message: "Failed to create feature request" });
    }
  });

  // Get feature request history
  app.get('/api/v1/features/history', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const requests = await storage.getUserFeatureRequests(user.id, limit, offset);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching feature history:", error);
      res.status(500).json({ message: "Failed to fetch feature history" });
    }
  });

  // ==================== Data Sharing Program Routes ====================
  
  // Opt-in/out of data sharing
  app.post('/api/v1/data-sharing/opt-in', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { optIn, profitSplit } = req.body;
      
      if (typeof optIn !== 'boolean') {
        return res.status(400).json({ message: "optIn must be a boolean" });
      }
      
      if (profitSplit && ![50, 100].includes(profitSplit)) {
        return res.status(400).json({ message: "profitSplit must be 50 or 100" });
      }
      
      const updatedUser = await storage.updateUserDataSharing(
        user.id, 
        optIn, 
        profitSplit || user.dataSharingProfitSplit
      );
      
      res.json({ 
        message: "Data sharing preferences updated",
        dataSharingOptIn: updatedUser.dataSharingOptIn,
        dataSharingProfitSplit: updatedUser.dataSharingProfitSplit,
      });
    } catch (error) {
      console.error("Error updating data sharing:", error);
      res.status(500).json({ message: "Failed to update data sharing preferences" });
    }
  });

  // ==================== WebSquare Marketplace Routes ====================
  
  // List WebSquare features
  app.get('/api/v1/websquare/features', async (req: Request, res: Response) => {
    try {
      const { category, sortBy, limit, offset } = req.query;
      
      const features = await storage.getWebSquareFeatures({
        category: category as string,
        sortBy: sortBy as 'rating' | 'installCount',
        limit: limit ? parseInt(limit as string) : 20,
        offset: offset ? parseInt(offset as string) : 0,
      });
      
      res.json(features);
    } catch (error) {
      console.error("Error fetching WebSquare features:", error);
      res.status(500).json({ message: "Failed to fetch features" });
    }
  });

  // Submit new WebSquare feature (Premium only)
  app.post('/api/v1/websquare/features', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user is premium
      if (user.subscriptionTier === 'free') {
        return res.status(403).json({ message: "Premium subscription required" });
      }
      
      // Validate request
      const validationResult = insertWebSquareFeatureSchema.safeParse({
        creatorId: user.id,
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        isCreatorManaged: req.body.isCreatorManaged ?? true,
      });
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid request", 
          errors: validationResult.error.errors 
        });
      }
      
      const feature = await storage.createWebSquareFeature(validationResult.data);
      res.json(feature);
    } catch (error) {
      console.error("Error creating WebSquare feature:", error);
      res.status(500).json({ message: "Failed to create feature" });
    }
  });

  // Get single WebSquare feature
  app.get('/api/v1/websquare/features/:featureId', async (req: Request, res: Response) => {
    try {
      const feature = await storage.getWebSquareFeature(req.params.featureId);
      if (!feature) {
        return res.status(404).json({ message: "Feature not found" });
      }
      
      // Get ratings
      const ratings = await storage.getFeatureRatings(feature.id);
      const avgRating = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;
      
      res.json({
        ...feature,
        ratings: ratings.length,
        averageRating: avgRating,
      });
    } catch (error) {
      console.error("Error fetching WebSquare feature:", error);
      res.status(500).json({ message: "Failed to fetch feature" });
    }
  });

  // Install WebSquare feature
  app.post('/api/v1/websquare/features/:featureId/install', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const feature = await storage.incrementFeatureInstalls(req.params.featureId);
      res.json({ 
        message: "Feature installed",
        installCount: feature.installCount 
      });
    } catch (error) {
      console.error("Error installing feature:", error);
      res.status(500).json({ message: "Failed to install feature" });
    }
  });

  // Rate WebSquare feature
  app.post('/api/v1/websquare/features/:featureId/rate', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user already rated
      const existingRating = await storage.getUserRatingForFeature(user.id, req.params.featureId);
      if (existingRating) {
        return res.status(400).json({ message: "You have already rated this feature" });
      }
      
      // Validate request
      const validationResult = insertWebSquareRatingSchema.safeParse({
        featureId: req.params.featureId,
        userId: user.id,
        rating: req.body.rating,
        reviewText: req.body.reviewText,
      });
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid request", 
          errors: validationResult.error.errors 
        });
      }
      
      const rating = await storage.createRating(validationResult.data);
      res.json(rating);
    } catch (error) {
      console.error("Error rating feature:", error);
      res.status(500).json({ message: "Failed to rate feature" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
