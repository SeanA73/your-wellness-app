# FitMatePro Fitness App Revamp Plan

## Executive Summary

This document outlines the comprehensive revamp of FitMatePro, focusing on personalized meal plans, advanced nutrition tracking, workout logging, progress analytics, notification systems, recipe suggestions, and affiliate marketing integration.

## Current State Analysis

### Existing Features ✅
- **Workout Planning**: Pre-built and custom workout programs with exercise library
- **Basic Nutrition Tracking**: Food logging with macro tracking (calories, protein, carbs, fats)
- **Mental Wellness**: Daily check-ins, mood tracking
- **AI Coaching**: Chat-based AI personal coach
- **User Authentication**: Supabase Auth integration
- **Subscription System**: Free, Premium, Pro tiers with Stripe integration
- **Product Recommendations**: Basic affiliate marketing with click tracking
- **Progress Visualization**: Weekly activity tracking, achievements

### Technology Stack
- **Frontend**: React 18 + TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Payment**: Stripe integration
- **Database**: PostgreSQL with Row Level Security

---

## Revamp Goals

### 1. **Personalized Meal Plans** 🍽️
- **AI-Generated Meal Plans**: Create weekly meal plans based on:
  - User goals (weight loss, muscle gain, maintenance)
  - Dietary preferences/allergies
  - Budget constraints
  - Time available for cooking
  - Current fitness level and workout schedule

### 2. **Advanced Macro & Calorie Tracking** 📊
- **Real-time Tracking Dashboard**: Enhanced progress visualization
- **Meal Timing Optimization**: Suggestions for pre/post workout meals
- **Macro Distribution**: Visual breakdowns by meal type
- **Historical Analysis**: Week/month/year trends
- **Barcode Scanner**: Quick food entry via barcode
- **Photo Recognition**: AI-powered food identification (currently mock)

### 3. **Comprehensive Workout Logs** 💪
- **Detailed Workout Tracking**: Sets, reps, weight, duration, RPE
- **Progressive Overload Visualization**: Track strength gains over time
- **Exercise Library**: Searchable database with instructions/videos
- **Template Workouts**: Save and reuse custom routines
- **Volume & Intensity Metrics**: Calculate total volume, 1RM estimates

### 4. **Intelligent Progress Reports** 📈
- **Weekly Summaries**: Auto-generated progress reports
- **Body Composition Tracking**: Photos, measurements, body fat %
- **Strength Progression Charts**: Visual strength gains
- **Nutrition Insights**: Macronutrient adherence, meal timing patterns
- **Habit Streaks**: Consistency tracking for workouts/nutrition
- **Goal Achievement**: Automated goal completion tracking

### 5. **Smart Notification System** 🔔
- **Workout Reminders**: Customizable time-based notifications
- **Meal Timing**: Pre/post workout meal alerts
- **Hydration Reminders**: Water intake notifications
- **Goal Check-ins**: Weekly progress review prompts
- **Recovery Tips**: Sleep and rest day suggestions
- **Streak Maintainers**: Motivation to keep consistency

### 6. **Enhanced Recipe Suggestions** 👨‍🍳
- **Personalized Recipe Feed**: Based on preferences and goals
- **Meal Prep Friendly**: Recipes with batch cooking instructions
- **Macro-Matched Recipes**: Suggestions meeting daily targets
- **Shopping Lists**: Auto-generated grocery lists
- **Recipe Collections**: Save favorites, create custom collections
- **Nutritional Analysis**: Full breakdown per serving

### 7. **Affiliate Marketing Integration** 💰
- **Contextual Product Recommendations**: Show products at relevant moments
- **Recipe-Product Pairing**: Suggest kitchen tools with recipes
- **Workout Equipment**: Recommend equipment during workout planning
- **Supplement Recommendations**: Based on nutrition gaps/goals
- **Review & Rating System**: User reviews on affiliate products
- **Revenue Dashboard**: Track affiliate performance (admin)

---

## Database Schema Enhancements

### New Tables Needed

#### 1. `meal_plans`
```sql
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_calories DECIMAL(6,2),
  protein_g DECIMAL(6,2),
  carbs_g DECIMAL(6,2),
  fats_g DECIMAL(6,2),
  is_active BOOLEAN DEFAULT true,
  preferences JSONB, -- dietary restrictions, allergies, etc.
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. `meal_plan_items`
```sql
CREATE TABLE meal_plan_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  serving_size DECIMAL(5,2) DEFAULT 1.0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. `recipes`
```sql
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  prep_time INTEGER, -- minutes
  cook_time INTEGER, -- minutes
  servings INTEGER,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  cuisine_type TEXT,
  meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack', 'dessert')),
  
  -- Nutrition per serving
  calories_per_serving DECIMAL(6,2),
  protein_per_serving DECIMAL(5,2),
  carbs_per_serving DECIMAL(5,2),
  fats_per_serving DECIMAL(5,2),
  fiber_per_serving DECIMAL(5,2),
  
  ingredients JSONB NOT NULL, -- [{name, amount, unit}, ...]
  instructions JSONB NOT NULL, -- ["step 1", "step 2", ...]
  
  image_urls TEXT[],
  video_url TEXT,
  tags TEXT[],
  
  created_by UUID REFERENCES profiles(id),
  is_public BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  rating_average DECIMAL(3,2),
  rating_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. `workout_logs` (Enhanced)
```sql
CREATE TABLE workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  workout_type TEXT NOT NULL, -- 'free_weight', 'cardio', 'bodyweight', etc.
  workout_name TEXT NOT NULL,
  
  -- Duration & Intensity
  duration_minutes INTEGER,
  calories_burned INTEGER,
  perceived_exertion INTEGER CHECK (perceived_exertion BETWEEN 1 AND 10),
  
  -- Location & Notes
  location TEXT, -- 'gym', 'home', 'outdoor'
  notes TEXT,
  mood_before INTEGER CHECK (mood_before BETWEEN 1 AND 10),
  mood_after INTEGER CHECK (mood_after BETWEEN 1 AND 10),
  
  -- Relationships
  workout_program_id UUID REFERENCES workout_programs(id),
  workout_day_id UUID,
  
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 5. `exercise_logs`
```sql
CREATE TABLE exercise_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_log_id UUID REFERENCES workout_logs(id) ON DELETE CASCADE,
  exercise_id UUID, -- reference to exercise library
  
  exercise_name TEXT NOT NULL,
  exercise_type TEXT, -- 'strength', 'cardio', 'flexibility'
  
  -- Sets data
  sets JSONB NOT NULL, -- [{set_number, reps, weight, rest_seconds, completed}, ...]
  total_volume DECIMAL(8,2), -- calculated: sum(reps * weight)
  estimated_1rm DECIMAL(6,2),
  
  duration_seconds INTEGER,
  distance_meters DECIMAL(8,2), -- for cardio
  
  rest_between_sets INTEGER, -- seconds
  rpe INTEGER CHECK (rpe BETWEEN 1 AND 10), -- rate of perceived exertion
  
  notes TEXT,
  order_index INTEGER,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 6. `progress_reports`
```sql
CREATE TABLE progress_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  report_type TEXT NOT NULL, -- 'weekly', 'monthly', 'goal_completion'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Workout stats
  total_workouts INTEGER DEFAULT 0,
  total_duration_minutes INTEGER DEFAULT 0,
  total_volume DECIMAL(10,2),
  avg_rpe DECIMAL(4,2),
  
  -- Nutrition stats
  avg_daily_calories DECIMAL(8,2),
  avg_daily_protein DECIMAL(8,2),
  avg_daily_carbs DECIMAL(8,2),
  avg_daily_fats DECIMAL(8,2),
  macro_adherence_percentage DECIMAL(5,2),
  
  -- Wellness stats
  avg_mood DECIMAL(4,2),
  avg_energy DECIMAL(4,2),
  avg_sleep_quality DECIMAL(4,2),
  avg_stress DECIMAL(4,2),
  
  -- Goals progress
  goals_achieved INTEGER DEFAULT 0,
  goals_total INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  
  -- Analysis
  insights JSONB, -- AI-generated insights
  recommendations JSONB, -- AI-generated recommendations
  
  is_read BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 7. `user_notifications`
```sql
CREATE TABLE user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  notification_type TEXT NOT NULL, -- 'workout_reminder', 'meal_time', 'hydration', 'goal_checkin', 'streak', 'system'
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  
  -- Action data
  action_url TEXT, -- deep link
  action_text TEXT, -- button text
  action_data JSONB,
  
  -- Scheduling
  scheduled_for TIMESTAMP NOT NULL,
  sent_at TIMESTAMP,
  
  -- Tracking
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  clicked BOOLEAN DEFAULT false,
  clicked_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 8. `shopping_lists`
```sql
CREATE TABLE shopping_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  generated_from UUID, -- meal_plan_id or recipe_id
  
  items JSONB NOT NULL, -- [{name, quantity, unit, category, is_purchased}, ...]
  
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 9. `user_preferences` (Enhanced)
```sql
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS notification_preferences JSONB;
-- {
--   "workout_reminders": {"enabled": true, "time": "07:00", "frequency": "daily"},
--   "meal_reminders": {"enabled": true, "times": ["08:00", "12:00", "18:00"]},
--   "hydration_reminders": {"enabled": true, "interval_minutes": 120},
--   "goal_checkins": {"enabled": true, "day": "sunday", "time": "20:00"},
--   "weekly_report": {"enabled": true, "day": "monday", "time": "09:00"},
--   "streak_alerts": {"enabled": true},
--   "marketing_emails": {"enabled": false}
-- }
```

---

## Frontend Component Architecture

### New Components Needed

#### 1. Meal Planning Components
- `src/components/nutrition/MealPlanBuilder.tsx` - Create/edit meal plans
- `src/components/nutrition/MealPlanCalendar.tsx` - Weekly meal plan view
- `src/components/nutrition/MealPlanItem.tsx` - Individual meal display
- `src/components/nutrition/MealPlanNutritionSummary.tsx` - Daily/weekly totals

#### 2. Recipe Components
- `src/components/recipes/RecipeCard.tsx` - Recipe preview card
- `src/components/recipes/RecipeDetail.tsx` - Full recipe view
- `src/components/recipes/RecipeFilters.tsx` - Search/filter recipes
- `src/components/recipes/RecipeEditor.tsx` - Create/edit recipes
- `src/components/recipes/IngredientList.tsx` - Ingredient display
- `src/components/recipes/InstructionSteps.tsx` - Cooking instructions

#### 3. Workout Logging Components
- `src/components/workout/WorkoutLogSession.tsx` - Active workout log
- `src/components/workout/ExerciseLogEditor.tsx` - Log individual exercises
- `src/components/workout/SetRow.tsx` - Sets/reps/weight input
- `src/components/workout/WorkoutLogHistory.tsx` - Past workouts
- `src/components/workout/VolumeChart.tsx` - Volume progression
- `src/components/workout/StrengthChart.tsx` - Strength progression

#### 4. Progress & Analytics Components
- `src/components/progress/WeeklyReportCard.tsx` - Report preview
- `src/components/progress/ProgressInsights.tsx` - AI insights
- `src/components/progress/ProgressCharts.tsx` - Visual charts
- `src/components/progress/GoalTracker.tsx` - Goal progress
- `src/components/progress/HabitStreak.tsx` - Streak visualization
- `src/components/progress/BodyCompositionTracker.tsx` - Photos/measurements

#### 5. Notification Components
- `src/components/notifications/NotificationCenter.tsx` - Notification panel
- `src/components/notifications/NotificationSettings.tsx` - Settings
- `src/components/notifications/NotificationCard.tsx` - Single notification
- `src/components/notifications/NotificationBell.tsx` - Header icon/badge

#### 6. Shopping List Components
- `src/components/shopping/ShoppingListBuilder.tsx` - Generate from meal plan
- `src/components/shopping/ShoppingListCard.tsx` - List view
- `src/components/shopping/ShoppingListItem.tsx` - Individual item

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2) 🏗️
**Priority: Critical Infrastructure**

1. **Database Migrations**
   - Create all new tables
   - Set up RLS policies
   - Add indexes for performance

2. **Supabase Functions**
   - Meal plan generator function
   - Progress report generator function
   - Notification scheduler function

3. **API Layer**
   - Custom hooks for new features
   - Type definitions
   - Error handling

**Deliverables:**
- ✅ Database schema deployed
- ✅ Backend functions working
- ✅ API hooks implemented

---

### Phase 2: Enhanced Nutrition (Week 2-3) 🍽️
**Priority: High - Core Feature**

1. **Meal Planning System**
   - Meal plan builder UI
   - Weekly calendar view
   - Auto-generation from goals

2. **Recipe System**
   - Recipe database & search
   - Recipe detail pages
   - Create custom recipes
   - Recipe suggestions

3. **Shopping Lists**
   - Auto-generate from meal plans
   - Manual editing
   - Check-off functionality

**Deliverables:**
- ✅ Users can create/import meal plans
- ✅ Recipe database populated
- ✅ Shopping lists work

---

### Phase 3: Advanced Workout Logging (Week 3-4) 💪
**Priority: High - Core Feature**

1. **Workout Log Session**
   - Real-time logging during workouts
   - Exercise library integration
   - Timer & rest periods

2. **Progressive Tracking**
   - Volume calculations
   - Strength progression charts
   - 1RM estimates

3. **Workout History**
   - Past workout views
   - Filter/search by date/type
   - Export data

**Deliverables:**
- ✅ Users can log detailed workouts
- ✅ Visual progress tracking
- ✅ Historical data available

---

### Phase 4: Progress Reports & Analytics (Week 4-5) 📊
**Priority: Medium - Engagement**

1. **Automated Reports**
   - Weekly progress generation
   - AI insights integration
   - Goal tracking

2. **Visual Analytics**
   - Interactive charts (Recharts)
   - Trend analysis
   - Comparison views

3. **Body Composition**
   - Photo upload & storage
   - Measurement tracking
   - Progress photos

**Deliverables:**
- ✅ Automated weekly reports
- ✅ Comprehensive analytics dashboard
- ✅ Body comp tracking

---

### Phase 5: Notification System (Week 5) 🔔
**Priority: Medium - Retention**

1. **Notification Infrastructure**
   - Push notification setup (if needed)
   - In-app notifications
   - Email notifications

2. **Smart Scheduling**
   - Reminder configuration
   - Context-aware timing
   - Do-not-disturb hours

3. **Notification Center**
   - In-app notification panel
   - Mark as read/unread
   - Notification history

**Deliverables:**
- ✅ Notification scheduling works
- ✅ Users receive timely reminders
- ✅ Notification center functional

---

### Phase 6: Enhanced Affiliate Marketing (Week 6) 💰
**Priority: Medium - Monetization**

1. **Contextual Recommendations**
   - Show products at optimal moments
   - Recipe-equipment pairing
   - Supplement suggestions

2. **Product Reviews**
   - User review system
   - Rating aggregation
   - Review display

3. **Analytics Dashboard** (Admin)
   - Click tracking
   - Conversion metrics
   - Revenue reports

**Deliverables:**
- ✅ Contextual product placement
- ✅ User review system
- ✅ Admin analytics dashboard

---

### Phase 7: Polish & Testing (Week 7) ✨
**Priority: All**

1. **UI/UX Refinements**
   - Design consistency
   - Mobile responsiveness
   - Accessibility improvements

2. **Performance Optimization**
   - Query optimization
   - Image optimization
   - Lazy loading

3. **Testing & QA**
   - Unit tests
   - Integration tests
   - User acceptance testing

4. **Documentation**
   - User guides
   - Admin documentation
   - API documentation

**Deliverables:**
- ✅ Bug-free app
- ✅ Fast performance
- ✅ Complete documentation

---

## Design Improvements

### Visual Enhancements
1. **Dashboard Redesign**
   - Hero metrics at top (weight, body fat %, strength PR)
   - Quick action cards
   - Recent activity feed
   - Progress charts

2. **Color System**
   - Success: Green (nutrition goals met, workout completed)
   - Warning: Orange (missing meals, missed workouts)
   - Info: Blue (tips, suggestions, insights)
   - Primary: Purple (actions, CTAs)

3. **Mobile-First Design**
   - Bottom navigation for mobile
   - Swipe gestures for quick actions
   - Optimized forms for mobile input

4. **Micro-interactions**
   - Celebration animations on achievements
   - Smooth transitions between states
   - Loading skeletons
   - Confetti for milestones

### UX Improvements
1. **Onboarding Flow**
   - Progressive profiling
   - Goal setting wizard
   - Guided first workout/nutrition log

2. **Empty States**
   - Helpful prompts
   - Guided actions
   - Educational content

3. **Error Handling**
   - Clear error messages
   - Retry mechanisms
   - Offline support

---

## Technical Implementation Details

### AI Integration (Future)
- **Claude/GPT API** for:
  - Meal plan generation
  - Recipe suggestions
  - Progress insights
  - Motivational messages

### External APIs to Consider
- **Spoonacular API**: Recipe database
- **USDA FoodData**: Food nutrition data
- **ExerciseDB**: Exercise library
- **OneSignal/Pusher**: Push notifications

### Performance Considerations
- **Query Optimization**: Use indexes, selective queries
- **Caching**: React Query for client-side caching
- **Image Optimization**: Next-gen formats (WebP, AVIF)
- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Components and data

---

## Success Metrics (KPIs)

### User Engagement
- **DAU/MAU**: Target 40%+ MAU
- **Workout Logging**: 5+ workouts/week average
- **Nutrition Logging**: 3+ meals/day average
- **Session Duration**: 10+ minutes average

### Feature Adoption
- **Meal Plans**: 60%+ of users try meal planning
- **Workout Logs**: 80%+ of users log workouts
- **Progress Reports**: 50%+ read weekly reports
- **Notifications**: 70%+ enable notifications

### Business Metrics
- **Subscription Conversion**: 15%+ free-to-paid
- **Affiliate Revenue**: $X per user per month
- **User Retention**: 70%+ at 30 days
- **Net Promoter Score**: 50+

---

## Risk Mitigation

### Technical Risks
- **Database Performance**: Monitor query times, add indexes
- **External API Reliability**: Implement fallbacks, caching
- **Notification Delivery**: Use multiple channels
- **Data Migration**: Thorough testing, rollback plan

### Product Risks
- **User Overwhelm**: Gradual feature rollout
- **Low Adoption**: A/B test positioning
- **Data Privacy**: Clear privacy policy, GDPR compliance

---

## Next Steps

1. **Review & Approval**: Get stakeholder sign-off
2. **Resource Allocation**: Assign developers
3. **Sprint Planning**: Break phases into sprints
4. **Start Phase 1**: Begin database migrations

---

## Questions & Decisions Needed

1. **AI Provider**: Claude vs GPT-4? Budget?
2. **Push Notifications**: Native vs web push?
3. **Recipe Database**: Build own vs use API?
4. **Photo Storage**: Supabase vs Cloudinary?
5. **Analytics**: Mixpanel vs Amplitude?
6. **Testing**: Testing framework preference?

---

**Last Updated**: January 2025  
**Status**: Planning Phase  
**Next Review**: [Date]


