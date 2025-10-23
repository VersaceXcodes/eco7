import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';
import { z } from 'zod';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

// Import Zod schemas
import {
  userSchema, createUserInputSchema, updateUserInputSchema, searchUserInputSchema,
  profileSchema, createProfileInputSchema, updateProfileInputSchema, searchProfileInputSchema,
  dashboardSchema, createDashboardInputSchema, updateDashboardInputSchema, searchDashboardInputSchema,
  carbonFootprintSchema, createCarbonFootprintInputSchema, updateCarbonFootprintInputSchema, searchCarbonFootprintInputSchema,
  weeklyReportSchema, createWeeklyReportInputSchema, updateWeeklyReportInputSchema, searchWeeklyReportInputSchema,
  forumSchema, createForumInputSchema, updateForumInputSchema, searchForumInputSchema,
  eventSchema, createEventInputSchema, updateEventInputSchema, searchEventInputSchema,
  resourceSchema, createResourceInputSchema, updateResourceInputSchema, searchResourceInputSchema,
  challengeSchema, createChallengeInputSchema, updateChallengeInputSchema, searchChallengeInputSchema,
  notificationSchema, createNotificationInputSchema, updateNotificationInputSchema, searchNotificationInputSchema,
  subscriptionSchema, createSubscriptionInputSchema, updateSubscriptionInputSchema, searchSubscriptionInputSchema,
  achievementSchema, createAchievementInputSchema, updateAchievementInputSchema, searchAchievementInputSchema
} from './schema.js';

dotenv.config();

// ESM workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment variables
const { DATABASE_URL, PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT = 5432, JWT_SECRET = 'eco7-jwt-secret-key' } = process.env;
const port = process.env.PORT || 3000;

// Database connection
const pool = new Pool(
  DATABASE_URL
    ? { 
        connectionString: DATABASE_URL, 
        ssl: { require: true } 
      }
    : {
        host: PGHOST,
        database: PGDATABASE,
        user: PGUSER,
        password: PGPASSWORD,
        port: Number(PGPORT),
        ssl: { require: true },
      }
);

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: "5mb" }));
app.use(morgan('combined'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Error response utility
interface ErrorResponse {
  success: false;
  message: string;
  error_code?: string;
  details?: any;
  timestamp: string;
}

function createErrorResponse(
  message: string,
  error?: any,
  errorCode?: string
): ErrorResponse {
  const response: ErrorResponse = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };

  if (errorCode) {
    response.error_code = errorCode;
  }

  if (error && process.env.NODE_ENV === 'development') {
    response.details = {
      name: error.name,
      message: error.message,
      stack: error.stack
    };
  }

  return response;
}

/*
Auth middleware for protected routes - validates JWT tokens and retrieves user information
*/
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json(createErrorResponse('Access token required', null, 'AUTH_TOKEN_MISSING'));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const result = await pool.query('SELECT user_id, email, name, created_at FROM users WHERE user_id = $1', [decoded.user_id]);
    
    if (result.rows.length === 0) {
      return res.status(401).json(createErrorResponse('Invalid token - user not found', null, 'AUTH_USER_NOT_FOUND'));
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    return res.status(403).json(createErrorResponse('Invalid or expired token', error, 'AUTH_TOKEN_INVALID'));
  }
};

/*
@@need:external-api: Carbon footprint calculation service to compute environmental impact based on user activities
For now, implementing a mock carbon footprint calculator that estimates CO2 emissions
*/
async function calculateCarbonFootprint(activities: string): Promise<{ footprint: number, breakdown: string }> {
  // Mock calculation - in production this would call an external environmental API
  const activitiesData = activities.toLowerCase();
  let footprint = 0;
  const breakdown = {};

  // Simple mock calculations based on activity keywords
  if (activitiesData.includes('car')) {
    breakdown['transportation'] = 450;
    footprint += 450;
  }
  if (activitiesData.includes('heating') || activitiesData.includes('energy')) {
    breakdown['energy'] = 300;
    footprint += 300;
  }
  if (activitiesData.includes('flight') || activitiesData.includes('plane')) {
    breakdown['travel'] = 1200;
    footprint += 1200;
  }
  if (activitiesData.includes('meat')) {
    breakdown['food'] = 150;
    footprint += 150;
  }

  // Default baseline if no specific activities detected
  if (footprint === 0) {
    footprint = 250;
    breakdown['general'] = 250;
  }

  return {
    footprint,
    breakdown: JSON.stringify(breakdown)
  };
}

/*
@@need:external-api: Weekly report generation service with AI-powered insights and personalized suggestions
Mock implementation that generates performance summaries and eco-friendly suggestions
*/
async function generateWeeklyReport(userId: string): Promise<{ summary: string, suggestions: string }> {
  // Mock report generation - in production would analyze user data and provide AI-powered insights
  const summaries = [
    "Great progress this week! You've reduced your carbon footprint by 15%",
    "Good effort on recycling initiatives. Room for improvement in energy consumption",
    "Excellent participation in community events. Keep up the eco-friendly habits!",
    "Steady progress towards your environmental goals. Focus on sustainable transport",
  ];

  const suggestions = [
    "Try using public transport twice this week",
    "Consider switching to energy-efficient appliances",
    "Join a local community clean-up event",
    "Reduce meat consumption by one day per week",
    "Use reusable bags for all shopping trips",
  ];

  return {
    summary: summaries[Math.floor(Math.random() * summaries.length)],
    suggestions: suggestions[Math.floor(Math.random() * suggestions.length)]
  };
}

// Authentication Routes

/*
User registration endpoint - creates new user account with email and password
Generates unique user ID and auth token, stores password directly for development
*/
app.post('/api/auth/register', async (req, res) => {
  try {
    const validatedData = createUserInputSchema.parse(req.body);
    const { email, password_hash, name, auth_token } = validatedData;

    // Check if user already exists
    const existingUser = await pool.query('SELECT user_id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json(createErrorResponse('User with this email already exists', null, 'USER_ALREADY_EXISTS'));
    }

    // Generate unique user ID and auth token
    const user_id = randomUUID();
    const generated_auth_token = jwt.sign({ user_id, email }, JWT_SECRET, { expiresIn: '7d' });
    
    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (user_id, email, name, auth_token, is_authenticated, created_at, password_hash) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [user_id, email, name || null, generated_auth_token, true, new Date().toISOString(), password_hash]
    );

    const user = result.rows[0];
    
    res.status(200).json({
      user_id: user.user_id,
      email: user.email,
      name: user.name,
      auth_token: user.auth_token,
      is_authenticated: user.is_authenticated,
      created_at: user.created_at,
      password_hash: user.password_hash
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(createErrorResponse('Invalid input data', error.errors, 'VALIDATION_ERROR'));
    }
    console.error('Registration error:', error);
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

/*
User login endpoint - authenticates user credentials and returns JWT token
Validates email and password, updates authentication status
*/
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password_hash } = req.body;

    if (!email || !password_hash) {
      return res.status(400).json(createErrorResponse('Email and password are required', null, 'MISSING_CREDENTIALS'));
    }

    // Find user by email and password (direct comparison for development)
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password_hash = $2', [email, password_hash]);
    
    if (result.rows.length === 0) {
      return res.status(400).json(createErrorResponse('Invalid email or password', null, 'INVALID_CREDENTIALS'));
    }

    const user = result.rows[0];
    
    // Generate new auth token
    const auth_token = jwt.sign({ user_id: user.user_id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    
    // Update user authentication status and token
    await pool.query('UPDATE users SET auth_token = $1, is_authenticated = TRUE WHERE user_id = $2', [auth_token, user.user_id]);

    res.status(200).json({
      user_id: user.user_id,
      email: user.email,
      name: user.name,
      auth_token: auth_token,
      is_authenticated: true,
      created_at: user.created_at,
      password_hash: user.password_hash
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

// User Routes

/*
Get user profile by ID - retrieves public user information
*/
app.get('/api/users/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    
    const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json(createErrorResponse('User not found', null, 'USER_NOT_FOUND'));
    }

    const user = result.rows[0];
    res.status(200).json({
      user_id: user.user_id,
      email: user.email,
      name: user.name,
      auth_token: user.auth_token,
      is_authenticated: user.is_authenticated,
      created_at: user.created_at,
      password_hash: user.password_hash
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

// Profile Routes

/*
Create or update user profile - handles profile information like eco goals and preferences
*/
app.post('/api/profiles', authenticateToken, async (req, res) => {
  try {
    const validatedData = createProfileInputSchema.parse(req.body);
    const { user_id, eco_goals, content_preferences, challenge_levels, avatar_url } = validatedData;

    // Check if profile already exists
    const existingProfile = await pool.query('SELECT * FROM profiles WHERE user_id = $1', [user_id]);
    
    if (existingProfile.rows.length > 0) {
      // Update existing profile
      const result = await pool.query(
        'UPDATE profiles SET eco_goals = $1, content_preferences = $2, challenge_levels = $3, avatar_url = $4 WHERE user_id = $5 RETURNING *',
        [eco_goals || null, content_preferences || null, challenge_levels || null, avatar_url || null, user_id]
      );
      
      res.status(200).json(result.rows[0]);
    } else {
      // Create new profile
      const profile_id = randomUUID();
      const result = await pool.query(
        'INSERT INTO profiles (profile_id, user_id, eco_goals, content_preferences, challenge_levels, avatar_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [profile_id, user_id, eco_goals || null, content_preferences || null, challenge_levels || null, avatar_url || null]
      );
      
      res.status(200).json(result.rows[0]);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(createErrorResponse('Invalid input data', error.errors, 'VALIDATION_ERROR'));
    }
    console.error('Create/update profile error:', error);
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

/*
Get profile by profile ID - retrieves specific profile details
*/
app.get('/api/profiles/:profile_id', authenticateToken, async (req, res) => {
  try {
    const { profile_id } = req.params;
    
    const result = await pool.query('SELECT * FROM profiles WHERE profile_id = $1', [profile_id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json(createErrorResponse('Profile not found', null, 'PROFILE_NOT_FOUND'));
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

/*
Update profile by profile ID - modifies existing profile information
*/
app.patch('/api/profiles/:profile_id', authenticateToken, async (req, res) => {
  try {
    const { profile_id } = req.params;
    const validatedData = updateProfileInputSchema.parse({ profile_id, ...req.body });
    
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (validatedData.eco_goals !== undefined) {
      updates.push(`eco_goals = $${paramCount++}`);
      values.push(validatedData.eco_goals);
    }
    if (validatedData.content_preferences !== undefined) {
      updates.push(`content_preferences = $${paramCount++}`);
      values.push(validatedData.content_preferences);
    }
    if (validatedData.challenge_levels !== undefined) {
      updates.push(`challenge_levels = $${paramCount++}`);
      values.push(validatedData.challenge_levels);
    }
    if (validatedData.avatar_url !== undefined) {
      updates.push(`avatar_url = $${paramCount++}`);
      values.push(validatedData.avatar_url);
    }

    if (updates.length === 0) {
      return res.status(400).json(createErrorResponse('No valid fields to update', null, 'NO_UPDATE_FIELDS'));
    }

    values.push(profile_id);
    
    const result = await pool.query(
      `UPDATE profiles SET ${updates.join(', ')} WHERE profile_id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json(createErrorResponse('Profile not found', null, 'PROFILE_NOT_FOUND'));
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(createErrorResponse('Invalid input data', error.errors, 'VALIDATION_ERROR'));
    }
    console.error('Update profile error:', error);
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

// Dashboard Routes

/*
Get user dashboard - aggregates user achievements, challenges, and suggestions
*/
app.get('/api/dashboards', authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json(createErrorResponse('user_id query parameter is required', null, 'MISSING_USER_ID'));
    }

    const result = await pool.query('SELECT * FROM dashboards WHERE user_id = $1', [user_id]);
    
    if (result.rows.length === 0) {
      // Create default dashboard if none exists
      const dashboard_id = randomUUID();
      const defaultDashboard = await pool.query(
        'INSERT INTO dashboards (dashboard_id, user_id, achievements, ongoing_challenges, suggestions) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [dashboard_id, user_id, 'Welcome to Eco7!', 'Start with our beginner challenges', 'Try reducing plastic use this week']
      );
      
      return res.status(200).json(defaultDashboard.rows[0]);
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

// Carbon Footprint Routes

/*
Create carbon footprint record - calculates and stores user's environmental impact
*/
app.post('/api/carbon-footprints', authenticateToken, async (req, res) => {
  try {
    const validatedData = createCarbonFootprintInputSchema.parse(req.body);
    const { user_id, daily_activities, calculated_footprint, activity_breakdown } = validatedData;

    let finalFootprint = calculated_footprint;
    let finalBreakdown = activity_breakdown;

    // Calculate footprint if not provided
    if (!calculated_footprint && daily_activities) {
      const calculation = await calculateCarbonFootprint(daily_activities);
      finalFootprint = calculation.footprint;
      finalBreakdown = calculation.breakdown;
    }

    const footprint_id = randomUUID();
    const result = await pool.query(
      'INSERT INTO carbon_footprint (footprint_id, user_id, daily_activities, calculated_footprint, activity_breakdown) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [footprint_id, user_id, daily_activities || null, finalFootprint || null, finalBreakdown || null]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(createErrorResponse('Invalid input data', error.errors, 'VALIDATION_ERROR'));
    }
    console.error('Create carbon footprint error:', error);
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

/*
Get carbon footprint records - retrieves user's carbon footprint history
*/
app.get('/api/carbon-footprints', authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json(createErrorResponse('user_id query parameter is required', null, 'MISSING_USER_ID'));
    }

    const result = await pool.query('SELECT * FROM carbon_footprint WHERE user_id = $1 ORDER BY footprint_id DESC', [user_id]);
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get carbon footprints error:', error);
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

// Weekly Reports Routes

/*
Create weekly report - generates personalized performance report with suggestions
*/
app.post('/api/weekly-reports', authenticateToken, async (req, res) => {
  try {
    const validatedData = createWeeklyReportInputSchema.parse(req.body);
    const { user_id, performance_summary, suggestions } = validatedData;

    let finalSummary = performance_summary;
    let finalSuggestions = suggestions;

    // Generate report if not provided
    if (!performance_summary || !suggestions) {
      const report = await generateWeeklyReport(user_id);
      finalSummary = finalSummary || report.summary;
      finalSuggestions = finalSuggestions || report.suggestions;
    }

    const report_id = randomUUID();
    const result = await pool.query(
      'INSERT INTO weekly_reports (report_id, user_id, performance_summary, suggestions) VALUES ($1, $2, $3, $4) RETURNING *',
      [report_id, user_id, finalSummary || null, finalSuggestions || null]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(createErrorResponse('Invalid input data', error.errors, 'VALIDATION_ERROR'));
    }
    console.error('Create weekly report error:', error);
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

/*
Get weekly reports - retrieves user's performance reports history
*/
app.get('/api/weekly-reports', authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json(createErrorResponse('user_id query parameter is required', null, 'MISSING_USER_ID'));
    }

    const result = await pool.query('SELECT * FROM weekly_reports WHERE user_id = $1 ORDER BY report_id DESC', [user_id]);
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get weekly reports error:', error);
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

// Forum Routes

/*
Create forum discussion - allows users to start new community discussions
*/
app.post('/api/forums', authenticateToken, async (req, res) => {
  try {
    const validatedData = createForumInputSchema.parse(req.body);
    const { user_id, title, content } = validatedData;

    const forum_id = randomUUID();
    const result = await pool.query(
      'INSERT INTO forums (forum_id, user_id, title, content, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [forum_id, user_id, title, content, new Date().toISOString()]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(createErrorResponse('Invalid input data', error.errors, 'VALIDATION_ERROR'));
    }
    console.error('Create forum error:', error);
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

/*
Get forums - retrieves forum discussions with optional filtering
*/
app.get('/api/forums', async (req, res) => {
  try {
    const { title, user_id } = req.query;
    
    let query = 'SELECT * FROM forums WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (title) {
      query += ` AND title ILIKE $${paramCount++}`;
      params.push(`%${title}%`);
    }

    if (user_id) {
      query += ` AND user_id = $${paramCount++}`;
      params.push(user_id);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get forums error:', error);
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

// Events Routes

/*
Create event - allows users to organize community events
*/
app.post('/api/events', authenticateToken, async (req, res) => {
  try {
    const validatedData = createEventInputSchema.parse(req.body);
    const { organizer_id, title, description, location, date_time, rsvp } = validatedData;

    const event_id = randomUUID();
    const result = await pool.query(
      'INSERT INTO events (event_id, organizer_id, title, description, location, date_time, rsvp) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [event_id, organizer_id, title, description || null, location || null, date_time || null, rsvp || null]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(createErrorResponse('Invalid input data', error.errors, 'VALIDATION_ERROR'));
    }
    console.error('Create event error:', error);
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

/*
Get events - retrieves community events with optional filtering
*/
app.get('/api/events', async (req, res) => {
  try {
    const { title, organizer_id } = req.query;
    
    let query = 'SELECT * FROM events WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (title) {
      query += ` AND title ILIKE $${paramCount++}`;
      params.push(`%${title}%`);
    }

    if (organizer_id) {
      query += ` AND organizer_id = $${paramCount++}`;
      params.push(organizer_id);
    }

    query += ' ORDER BY date_time DESC';

    const result = await pool.query(query, params);
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

// Resources Routes

/*
Get educational resources - retrieves learning materials with optional filtering
*/
app.get('/api/resources', async (req, res) => {
  try {
    const { category, posted_on } = req.query;
    
    let query = 'SELECT * FROM resources WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (category) {
      query += ` AND category ILIKE $${paramCount++}`;
      params.push(`%${category}%`);
    }

    if (posted_on) {
      query += ` AND DATE(posted_on) = DATE($${paramCount++})`;
      params.push(posted_on);
    }

    query += ' ORDER BY posted_on DESC';

    const result = await pool.query(query, params);
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

// Challenges Routes

/*
Create challenge - allows users to create eco-friendly challenges
*/
app.post('/api/challenges', authenticateToken, async (req, res) => {
  try {
    const validatedData = createChallengeInputSchema.parse(req.body);
    const { user_id, title, description, frequency, points_awarded } = validatedData;

    const challenge_id = randomUUID();
    const result = await pool.query(
      'INSERT INTO challenges (challenge_id, user_id, title, description, frequency, points_awarded) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [challenge_id, user_id, title, description || null, frequency || null, points_awarded || null]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json(createErrorResponse('Invalid input data', error.errors, 'VALIDATION_ERROR'));
    }
    console.error('Create challenge error:', error);
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

/*
Get challenges - retrieves eco challenges with optional filtering
*/
app.get('/api/challenges', async (req, res) => {
  try {
    const { title, user_id } = req.query;
    
    let query = 'SELECT * FROM challenges WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (title) {
      query += ` AND title ILIKE $${paramCount++}`;
      params.push(`%${title}%`);
    }

    if (user_id) {
      query += ` AND user_id = $${paramCount++}`;
      params.push(user_id);
    }

    query += ' ORDER BY challenge_id DESC';

    const result = await pool.query(query, params);
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

// Notifications Routes

/*
Get notifications - retrieves user notifications
*/
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json(createErrorResponse('user_id query parameter is required', null, 'MISSING_USER_ID'));
    }

    const result = await pool.query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC', [user_id]);
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json(createErrorResponse('Internal server error', error, 'INTERNAL_SERVER_ERROR'));
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Catch-all route for SPA routing - serve index.html for non-API routes
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

export { app, pool };

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Eco7 server running on port ${port} and listening on 0.0.0.0`);
});