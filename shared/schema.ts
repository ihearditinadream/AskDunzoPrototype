import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  boolean,
  integer,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
// Enhanced with subscription and data sharing fields
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  phoneNumber: varchar("phone_number", { length: 50 }).unique(),
  subscriptionTier: varchar("subscription_tier", { length: 20 }).notNull().default('free'), // 'free', 'premium', 'lifetime'
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  dataSharingOptIn: boolean("data_sharing_opt_in").notNull().default(false),
  dataSharingProfitSplit: integer("data_sharing_profit_split").notNull().default(50), // 50 or 100
  featureRequestsCount: integer("feature_requests_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Feature requests table
export const featureRequests = pgTable("feature_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  websiteUrl: varchar("website_url", { length: 500 }).notNull(),
  featureDescription: text("feature_description").notNull(),
  targetElement: varchar("target_element", { length: 255 }),
  status: varchar("status", { length: 50 }).notNull().default('pending'), // 'pending', 'processing', 'completed', 'failed'
  generatedCode: text("generated_code"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// WebSquare features table
export const webSquareFeatures = pgTable("websquare_features", {
  id: uuid("id").defaultRandom().primaryKey(),
  creatorId: varchar("creator_id", { length: 255 }).notNull().references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  installCount: integer("install_count").notNull().default(0),
  isVerified: boolean("is_verified").notNull().default(false),
  isCreatorManaged: boolean("is_creator_managed").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// WebSquare ratings table
export const webSquareRatings = pgTable("websquare_ratings", {
  id: uuid("id").defaultRandom().primaryKey(),
  featureId: uuid("feature_id").notNull().references(() => webSquareFeatures.id),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  rating: integer("rating").notNull(),
  reviewText: text("review_text"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Referrals table
export const referrals = pgTable("referrals", {
  id: uuid("id").defaultRandom().primaryKey(),
  referrerId: varchar("referrer_id", { length: 255 }).notNull().references(() => users.id),
  referredId: varchar("referred_id", { length: 255 }).notNull().references(() => users.id),
  isConfirmed: boolean("is_confirmed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  featureRequests: many(featureRequests),
  webSquareFeatures: many(webSquareFeatures),
  webSquareRatings: many(webSquareRatings),
  referralsSent: many(referrals, { relationName: 'referrer' }),
  referralsReceived: many(referrals, { relationName: 'referred' }),
}));

export const featureRequestsRelations = relations(featureRequests, ({ one }) => ({
  user: one(users, {
    fields: [featureRequests.userId],
    references: [users.id],
  }),
}));

export const webSquareFeaturesRelations = relations(webSquareFeatures, ({ one, many }) => ({
  creator: one(users, {
    fields: [webSquareFeatures.creatorId],
    references: [users.id],
  }),
  ratings: many(webSquareRatings),
}));

export const webSquareRatingsRelations = relations(webSquareRatings, ({ one }) => ({
  feature: one(webSquareFeatures, {
    fields: [webSquareRatings.featureId],
    references: [webSquareFeatures.id],
  }),
  user: one(users, {
    fields: [webSquareRatings.userId],
    references: [users.id],
  }),
}));

export const referralsRelations = relations(referrals, ({ one }) => ({
  referrer: one(users, {
    fields: [referrals.referrerId],
    references: [users.id],
    relationName: 'referrer',
  }),
  referred: one(users, {
    fields: [referrals.referredId],
    references: [users.id],
    relationName: 'referred',
  }),
}));

// Types and schemas
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type FeatureRequest = typeof featureRequests.$inferSelect;
export const insertFeatureRequestSchema = createInsertSchema(featureRequests).omit({ 
  id: true, 
  createdAt: true,
  status: true,
  generatedCode: true,
  expiresAt: true
});
export type InsertFeatureRequest = z.infer<typeof insertFeatureRequestSchema>;

export type WebSquareFeature = typeof webSquareFeatures.$inferSelect;
export const insertWebSquareFeatureSchema = createInsertSchema(webSquareFeatures).omit({ 
  id: true, 
  createdAt: true,
  installCount: true,
  isVerified: true 
});
export type InsertWebSquareFeature = z.infer<typeof insertWebSquareFeatureSchema>;

export type WebSquareRating = typeof webSquareRatings.$inferSelect;
export const insertWebSquareRatingSchema = createInsertSchema(webSquareRatings)
  .omit({ id: true, createdAt: true })
  .extend({
    rating: z.number().min(1).max(5),
  });
export type InsertWebSquareRating = z.infer<typeof insertWebSquareRatingSchema>;

export type Referral = typeof referrals.$inferSelect;
export const insertReferralSchema = createInsertSchema(referrals).omit({ 
  id: true, 
  createdAt: true,
  isConfirmed: true 
});
export type InsertReferral = z.infer<typeof insertReferralSchema>;
