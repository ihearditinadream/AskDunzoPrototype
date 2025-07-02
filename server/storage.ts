import {
  users,
  featureRequests,
  webSquareFeatures,
  webSquareRatings,
  referrals,
  type User,
  type UpsertUser,
  type FeatureRequest,
  type InsertFeatureRequest,
  type WebSquareFeature,
  type InsertWebSquareFeature,
  type WebSquareRating,
  type InsertWebSquareRating,
  type Referral,
  type InsertReferral,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUserSubscription(userId: string, data: {
    subscriptionTier?: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    subscriptionExpiresAt?: Date | null;
  }): Promise<User>;
  updateUserDataSharing(userId: string, optIn: boolean, profitSplit: number): Promise<User>;
  updateUserPhone(userId: string, phoneNumber: string): Promise<User>;
  
  // Feature request operations
  createFeatureRequest(data: InsertFeatureRequest): Promise<FeatureRequest>;
  getFeatureRequest(id: string): Promise<FeatureRequest | undefined>;
  getUserFeatureRequests(userId: string, limit?: number, offset?: number): Promise<FeatureRequest[]>;
  updateFeatureRequestStatus(id: string, status: string, generatedCode?: string): Promise<FeatureRequest>;
  
  // WebSquare operations
  createWebSquareFeature(data: InsertWebSquareFeature): Promise<WebSquareFeature>;
  getWebSquareFeature(id: string): Promise<WebSquareFeature | undefined>;
  getWebSquareFeatures(options?: {
    category?: string;
    sortBy?: 'rating' | 'installCount';
    limit?: number;
    offset?: number;
  }): Promise<WebSquareFeature[]>;
  incrementFeatureInstalls(id: string): Promise<WebSquareFeature>;
  
  // Rating operations
  createRating(data: InsertWebSquareRating): Promise<WebSquareRating>;
  getFeatureRatings(featureId: string): Promise<WebSquareRating[]>;
  getUserRatingForFeature(userId: string, featureId: string): Promise<WebSquareRating | undefined>;
  
  // Referral operations
  createReferral(data: InsertReferral): Promise<Referral>;
  confirmReferral(referredId: string): Promise<Referral | undefined>;
  getUserReferrals(userId: string): Promise<Referral[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async updateUserSubscription(userId: string, data: {
    subscriptionTier?: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    subscriptionExpiresAt?: Date | null;
  }): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserDataSharing(userId: string, optIn: boolean, profitSplit: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        dataSharingOptIn: optIn,
        dataSharingProfitSplit: profitSplit,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserPhone(userId: string, phoneNumber: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        phoneNumber,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Feature request operations
  async createFeatureRequest(data: InsertFeatureRequest): Promise<FeatureRequest> {
    const [request] = await db
      .insert(featureRequests)
      .values(data)
      .returning();
    
    // Increment user's feature request count
    await db
      .update(users)
      .set({
        featureRequestsCount: sql`${users.featureRequestsCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, data.userId));
    
    return request;
  }

  async getFeatureRequest(id: string): Promise<FeatureRequest | undefined> {
    const [request] = await db
      .select()
      .from(featureRequests)
      .where(eq(featureRequests.id, id));
    return request;
  }

  async getUserFeatureRequests(userId: string, limit: number = 20, offset: number = 0): Promise<FeatureRequest[]> {
    return await db
      .select()
      .from(featureRequests)
      .where(eq(featureRequests.userId, userId))
      .orderBy(desc(featureRequests.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async updateFeatureRequestStatus(id: string, status: string, generatedCode?: string): Promise<FeatureRequest> {
    const updateData: any = { status };
    if (generatedCode !== undefined) {
      updateData.generatedCode = generatedCode;
    }
    
    const [request] = await db
      .update(featureRequests)
      .set(updateData)
      .where(eq(featureRequests.id, id))
      .returning();
    return request;
  }

  // WebSquare operations
  async createWebSquareFeature(data: InsertWebSquareFeature): Promise<WebSquareFeature> {
    const [feature] = await db
      .insert(webSquareFeatures)
      .values(data)
      .returning();
    return feature;
  }

  async getWebSquareFeature(id: string): Promise<WebSquareFeature | undefined> {
    const [feature] = await db
      .select()
      .from(webSquareFeatures)
      .where(eq(webSquareFeatures.id, id));
    return feature;
  }

  async getWebSquareFeatures(options?: {
    category?: string;
    sortBy?: 'rating' | 'installCount';
    limit?: number;
    offset?: number;
  }): Promise<WebSquareFeature[]> {
    let conditions = [];
    
    if (options?.category) {
      conditions.push(eq(webSquareFeatures.category, options.category));
    }
    
    const orderByColumn = options?.sortBy === 'installCount' 
      ? webSquareFeatures.installCount 
      : webSquareFeatures.createdAt;
    
    const query = db
      .select()
      .from(webSquareFeatures)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(orderByColumn))
      .limit(options?.limit || 50)
      .offset(options?.offset || 0);
    
    return await query;
  }

  async incrementFeatureInstalls(id: string): Promise<WebSquareFeature> {
    const [feature] = await db
      .update(webSquareFeatures)
      .set({
        installCount: sql`${webSquareFeatures.installCount} + 1`,
      })
      .where(eq(webSquareFeatures.id, id))
      .returning();
    return feature;
  }

  // Rating operations
  async createRating(data: InsertWebSquareRating): Promise<WebSquareRating> {
    const [rating] = await db
      .insert(webSquareRatings)
      .values(data)
      .returning();
    return rating;
  }

  async getFeatureRatings(featureId: string): Promise<WebSquareRating[]> {
    return await db
      .select()
      .from(webSquareRatings)
      .where(eq(webSquareRatings.featureId, featureId))
      .orderBy(desc(webSquareRatings.createdAt));
  }

  async getUserRatingForFeature(userId: string, featureId: string): Promise<WebSquareRating | undefined> {
    const [rating] = await db
      .select()
      .from(webSquareRatings)
      .where(
        and(
          eq(webSquareRatings.userId, userId),
          eq(webSquareRatings.featureId, featureId)
        )
      );
    return rating;
  }

  // Referral operations
  async createReferral(data: InsertReferral): Promise<Referral> {
    const [referral] = await db
      .insert(referrals)
      .values(data)
      .returning();
    return referral;
  }

  async confirmReferral(referredId: string): Promise<Referral | undefined> {
    const [referral] = await db
      .update(referrals)
      .set({
        isConfirmed: true,
      })
      .where(eq(referrals.referredId, referredId))
      .returning();
    return referral;
  }

  async getUserReferrals(userId: string): Promise<Referral[]> {
    return await db
      .select()
      .from(referrals)
      .where(eq(referrals.referrerId, userId))
      .orderBy(desc(referrals.createdAt));
  }
}

export const storage = new DatabaseStorage();