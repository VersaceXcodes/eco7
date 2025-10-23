import { z } from 'zod';

// Users schema definitions
export const userSchema = z.object({
  user_id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  auth_token: z.string().nullable(),
  is_authenticated: z.boolean(),
  created_at: z.coerce.date(),
  password_hash: z.string()
});

export const createUserInputSchema = z.object({
  email: z.string().email().min(1),
  name: z.string().nullable().optional(),
  auth_token: z.string().nullable().optional(),
  password_hash: z.string().min(1)
});

export const updateUserInputSchema = z.object({
  user_id: z.string(),
  email: z.string().email().optional(),
  name: z.string().nullable().optional(),
  auth_token: z.string().nullable().optional(),
  is_authenticated: z.boolean().optional(),
  password_hash: z.string().optional()
});

export const searchUserInputSchema = z.object({
  email: z.string().optional(),
  name: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0)
});

export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserInputSchema>;
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;
export type SearchUserInput = z.infer<typeof searchUserInputSchema>;

// Profiles schema definitions
export const profileSchema = z.object({
  profile_id: z.string(),
  user_id: z.string(),
  eco_goals: z.string().nullable(),
  content_preferences: z.string().nullable(),
  challenge_levels: z.string().nullable(),
  avatar_url: z.string().url().nullable()
});

export const createProfileInputSchema = z.object({
  user_id: z.string(),
  eco_goals: z.string().nullable().optional(),
  content_preferences: z.string().nullable().optional(),
  challenge_levels: z.string().nullable().optional(),
  avatar_url: z.string().url().nullable().optional()
});

export const updateProfileInputSchema = z.object({
  profile_id: z.string(),
  user_id: z.string().optional(),
  eco_goals: z.string().nullable().optional(),
  content_preferences: z.string().nullable().optional(),
  challenge_levels: z.string().nullable().optional(),
  avatar_url: z.string().url().nullable().optional()
});

export const searchProfileInputSchema = z.object({
  user_id: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0)
});

export type Profile = z.infer<typeof profileSchema>;
export type CreateProfileInput = z.infer<typeof createProfileInputSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileInputSchema>;
export type SearchProfileInput = z.infer<typeof searchProfileInputSchema>;

// Dashboards schema definitions
export const dashboardSchema = z.object({
  dashboard_id: z.string(),
  user_id: z.string(),
  achievements: z.string().nullable(),
  ongoing_challenges: z.string().nullable(),
  suggestions: z.string().nullable()
});

export const createDashboardInputSchema = z.object({
  user_id: z.string(),
  achievements: z.string().nullable().optional(),
  ongoing_challenges: z.string().nullable().optional(),
  suggestions: z.string().nullable().optional()
});

export const updateDashboardInputSchema = z.object({
  dashboard_id: z.string(),
  user_id: z.string().optional(),
  achievements: z.string().nullable().optional(),
  ongoing_challenges: z.string().nullable().optional(),
  suggestions: z.string().nullable().optional()
});

export const searchDashboardInputSchema = z.object({
  user_id: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0)
});

export type Dashboard = z.infer<typeof dashboardSchema>;
export type CreateDashboardInput = z.infer<typeof createDashboardInputSchema>;
export type UpdateDashboardInput = z.infer<typeof updateDashboardInputSchema>;
export type SearchDashboardInput = z.infer<typeof searchDashboardInputSchema>;

// Carbon Footprint schema definitions
export const carbonFootprintSchema = z.object({
  footprint_id: z.string(),
  user_id: z.string(),
  daily_activities: z.string().nullable(),
  calculated_footprint: z.number().nullable(),
  activity_breakdown: z.string().nullable()
});

export const createCarbonFootprintInputSchema = z.object({
  user_id: z.string(),
  daily_activities: z.string().nullable().optional(),
  calculated_footprint: z.number().nullable().optional(),
  activity_breakdown: z.string().nullable().optional()
});

export const updateCarbonFootprintInputSchema = z.object({
  footprint_id: z.string(),
  user_id: z.string().optional(),
  daily_activities: z.string().nullable().optional(),
  calculated_footprint: z.number().nullable().optional(),
  activity_breakdown: z.string().nullable().optional()
});

export const searchCarbonFootprintInputSchema = z.object({
  user_id: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0)
});

export type CarbonFootprint = z.infer<typeof carbonFootprintSchema>;
export type CreateCarbonFootprintInput = z.infer<typeof createCarbonFootprintInputSchema>;
export type UpdateCarbonFootprintInput = z.infer<typeof updateCarbonFootprintInputSchema>;
export type SearchCarbonFootprintInput = z.infer<typeof searchCarbonFootprintInputSchema>;

// Weekly Reports schema definitions
export const weeklyReportSchema = z.object({
  report_id: z.string(),
  user_id: z.string(),
  performance_summary: z.string().nullable(),
  suggestions: z.string().nullable()
});

export const createWeeklyReportInputSchema = z.object({
  user_id: z.string(),
  performance_summary: z.string().nullable().optional(),
  suggestions: z.string().nullable().optional()
});

export const updateWeeklyReportInputSchema = z.object({
  report_id: z.string(),
  user_id: z.string().optional(),
  performance_summary: z.string().nullable().optional(),
  suggestions: z.string().nullable().optional()
});

export const searchWeeklyReportInputSchema = z.object({
  user_id: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0)
});

export type WeeklyReport = z.infer<typeof weeklyReportSchema>;
export type CreateWeeklyReportInput = z.infer<typeof createWeeklyReportInputSchema>;
export type UpdateWeeklyReportInput = z.infer<typeof updateWeeklyReportInputSchema>;
export type SearchWeeklyReportInput = z.infer<typeof searchWeeklyReportInputSchema>;

// Forums schema definitions
export const forumSchema = z.object({
  forum_id: z.string(),
  user_id: z.string(),
  title: z.string().min(1),
  content: z.string().min(1),
  created_at: z.coerce.date()
});

export const createForumInputSchema = z.object({
  user_id: z.string(),
  title: z.string().min(1),
  content: z.string().min(1)
});

export const updateForumInputSchema = z.object({
  forum_id: z.string(),
  user_id: z.string().optional(),
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional()
});

export const searchForumInputSchema = z.object({
  title: z.string().optional(),
  user_id: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0)
});

export type Forum = z.infer<typeof forumSchema>;
export type CreateForumInput = z.infer<typeof createForumInputSchema>;
export type UpdateForumInput = z.infer<typeof updateForumInputSchema>;
export type SearchForumInput = z.infer<typeof searchForumInputSchema>;

// Events schema definitions
export const eventSchema = z.object({
  event_id: z.string(),
  organizer_id: z.string(),
  title: z.string().min(1),
  description: z.string().nullable(),
  location: z.string().nullable(),
  date_time: z.coerce.date().nullable(),
  rsvp: z.string().nullable()
});

export const createEventInputSchema = z.object({
  organizer_id: z.string(),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  date_time: z.coerce.date().nullable().optional(),
  rsvp: z.string().nullable().optional()
});

export const updateEventInputSchema = z.object({
  event_id: z.string(),
  organizer_id: z.string().optional(),
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  date_time: z.coerce.date().nullable().optional(),
  rsvp: z.string().nullable().optional()
});

export const searchEventInputSchema = z.object({
  title: z.string().optional(),
  organizer_id: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0)
});

export type Event = z.infer<typeof eventSchema>;
export type CreateEventInput = z.infer<typeof createEventInputSchema>;
export type UpdateEventInput = z.infer<typeof updateEventInputSchema>;
export type SearchEventInput = z.infer<typeof searchEventInputSchema>;

// Resources schema definitions
export const resourceSchema = z.object({
  resource_id: z.string(),
  category: z.string().min(1),
  content: z.string().min(1),
  posted_on: z.coerce.date()
});

export const createResourceInputSchema = z.object({
  category: z.string().min(1),
  content: z.string().min(1),
  posted_on: z.coerce.date()
});

export const updateResourceInputSchema = z.object({
  resource_id: z.string(),
  category: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  posted_on: z.coerce.date().optional()
});

export const searchResourceInputSchema = z.object({
  category: z.string().optional(),
  posted_on: z.coerce.date().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0)
});

export type Resource = z.infer<typeof resourceSchema>;
export type CreateResourceInput = z.infer<typeof createResourceInputSchema>;
export type UpdateResourceInput = z.infer<typeof updateResourceInputSchema>;
export type SearchResourceInput = z.infer<typeof searchResourceInputSchema>;

// Challenges schema definitions
export const challengeSchema = z.object({
  challenge_id: z.string(),
  user_id: z.string(),
  title: z.string().min(1),
  description: z.string().nullable(),
  frequency: z.string().nullable(),
  points_awarded: z.number().nullable()
});

export const createChallengeInputSchema = z.object({
  user_id: z.string(),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  frequency: z.string().nullable().optional(),
  points_awarded: z.number().nullable().optional()
});

export const updateChallengeInputSchema = z.object({
  challenge_id: z.string(),
  user_id: z.string().optional(),
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  frequency: z.string().nullable().optional(),
  points_awarded: z.number().nullable().optional()
});

export const searchChallengeInputSchema = z.object({
  user_id: z.string().optional(),
  title: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0)
});

export type Challenge = z.infer<typeof challengeSchema>;
export type CreateChallengeInput = z.infer<typeof createChallengeInputSchema>;
export type UpdateChallengeInput = z.infer<typeof updateChallengeInputSchema>;
export type SearchChallengeInput = z.infer<typeof searchChallengeInputSchema>;

// Notifications schema definitions
export const notificationSchema = z.object({
  notification_id: z.string(),
  user_id: z.string(),
  message: z.string().min(1),
  type: z.string().nullable(),
  created_at: z.coerce.date()
});

export const createNotificationInputSchema = z.object({
  user_id: z.string(),
  message: z.string().min(1),
  type: z.string().nullable().optional(),
  created_at: z.coerce.date()
});

export const updateNotificationInputSchema = z.object({
  notification_id: z.string(),
  user_id: z.string().optional(),
  message: z.string().min(1).optional(),
  type: z.string().nullable().optional(),
  created_at: z.coerce.date().optional()
});

export const searchNotificationInputSchema = z.object({
  user_id: z.string().optional(),
  type: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0)
});

export type Notification = z.infer<typeof notificationSchema>;
export type CreateNotificationInput = z.infer<typeof createNotificationInputSchema>;
export type UpdateNotificationInput = z.infer<typeof updateNotificationInputSchema>;
export type SearchNotificationInput = z.infer<typeof searchNotificationInputSchema>;

// Subscriptions schema definitions
export const subscriptionSchema = z.object({
  subscription_id: z.string(),
  user_id: z.string(),
  newsletter: z.boolean()
});

export const createSubscriptionInputSchema = z.object({
  user_id: z.string(),
  newsletter: z.boolean().optional()
});

export const updateSubscriptionInputSchema = z.object({
  subscription_id: z.string(),
  user_id: z.string().optional(),
  newsletter: z.boolean().optional()
});

export const searchSubscriptionInputSchema = z.object({
  user_id: z.string().optional(),
  newsletter: z.boolean().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0)
});

export type Subscription = z.infer<typeof subscriptionSchema>;
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionInputSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionInputSchema>;
export type SearchSubscriptionInput = z.infer<typeof searchSubscriptionInputSchema>;

// Achievements schema definitions
export const achievementSchema = z.object({
  achievement_id: z.string(),
  user_id: z.string(),
  badge_name: z.string().min(1),
  date_achieved: z.coerce.date()
});

export const createAchievementInputSchema = z.object({
  user_id: z.string(),
  badge_name: z.string().min(1),
  date_achieved: z.coerce.date()
});

export const updateAchievementInputSchema = z.object({
  achievement_id: z.string(),
  user_id: z.string().optional(),
  badge_name: z.string().min(1).optional(),
  date_achieved: z.coerce.date().optional()
});

export const searchAchievementInputSchema = z.object({
  user_id: z.string().optional(),
  badge_name: z.string().optional(),
  limit: z.number().int().positive().default(10),
  offset: z.number().int().nonnegative().default(0)
});

export type Achievement = z.infer<typeof achievementSchema>;
export type CreateAchievementInput = z.infer<typeof createAchievementInputSchema>;
export type UpdateAchievementInput = z.infer<typeof updateAchievementInputSchema>;
export type SearchAchievementInput = z.infer<typeof searchAchievementInputSchema>;