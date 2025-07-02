// Server configuration and environment variable validation

// Ensure environment variables are loaded
import dotenv from "dotenv";
dotenv.config();

export const config = {
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    premiumPriceId: process.env.STRIPE_PREMIUM_PRICE_ID || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },
  ai: {
    geminiApiKey: process.env.GEMINI_API_KEY || '',
  },
  session: {
    secret: process.env.SESSION_SECRET || 'default-session-secret-change-in-production',
  },
  app: {
    domain: process.env.REPLIT_DEV_DOMAIN || 'http://localhost:5000',
  },
};

// Validation function to check required config
export function validateConfig() {
  const warnings: string[] = [];
  
  if (!config.stripe.secretKey) {
    warnings.push('⚠️  STRIPE_SECRET_KEY is not set - payment features will be disabled');
  }
  if (!config.stripe.premiumPriceId && config.stripe.secretKey) {
    warnings.push('⚠️  STRIPE_PREMIUM_PRICE_ID is not set - monthly subscriptions will fail');
  }
  if (!config.stripe.webhookSecret && config.stripe.secretKey) {
    warnings.push('⚠️  STRIPE_WEBHOOK_SECRET is not set - webhook events will fail');
  }
  if (!config.ai.geminiApiKey) {
    warnings.push('⚠️  GEMINI_API_KEY is not set - AI feature generation will be disabled');
  }
  if (config.session.secret === 'default-session-secret-change-in-production') {
    warnings.push('⚠️  SESSION_SECRET is using default value - please set a secure secret for production');
  }
  
  if (warnings.length > 0) {
    console.log('\n🔧 Configuration Warnings:');
    warnings.forEach(warning => console.log(warning));
    console.log('\n');
  }
  
  return warnings;
}