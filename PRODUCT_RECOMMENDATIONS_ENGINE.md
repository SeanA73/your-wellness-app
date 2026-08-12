# AI-Powered Product Recommendation Engine

## Overview

The Product Recommendation Engine is an intelligent system that suggests fitness gear based on:
- **User's workout history** (types, frequency, intensity)
- **Fitness goals** (strength, weight loss, endurance, etc.)
- **User preferences** (activity level, preferred workout times)
- **Context** (workout planning, post-workout, goal-based)

## Architecture

### Database Schema

The system uses three main tables:

1. **`product_recommendations`** - Stores personalized recommendations for each user
   - Links users to products
   - Contains AI-generated recommendation reasons
   - Tracks confidence scores and priority
   - Records user interactions (clicks, dismissals, purchases)

2. **`recommendation_feedback`** - Stores user feedback on recommendations
   - Allows users to provide feedback (helpful, not helpful, etc.)
   - Used to improve future recommendations

3. **`recommendation_generations`** - Tracks AI recommendation generation history
   - Records when recommendations were generated
   - Stores metadata about the generation process

### Key Components

#### 1. `useProductRecommendations` Hook (`src/hooks/useProductRecommendations.tsx`)

A React hook that provides:
- **Recommendation loading**: Fetches personalized recommendations from the database
- **Workout analysis**: Analyzes user's workout history to understand patterns
- **Goal analysis**: Extracts fitness goals from user profile
- **AI generation**: Generates recommendations using intelligent scoring algorithm
- **Interaction tracking**: Tracks clicks, dismissals, and purchases
- **Feedback system**: Allows users to provide feedback on recommendations

**Usage:**
```tsx
const {
  recommendations,
  loading,
  generating,
  workoutAnalysis,
  goalAnalysis,
  generateRecommendations,
  trackInteraction,
  provideFeedback,
  refresh
} = useProductRecommendations({
  context: "general", // or "workout_planning", "post_workout", "goal_based"
  limit: 8,
  autoGenerate: true
});
```

#### 2. `AIProductRecommendations` Component (`src/components/shop/AIProductRecommendations.tsx`)

A React component that displays AI-powered product recommendations with:
- **Visual product cards** with images, prices, and ratings
- **Confidence score indicators** showing match quality
- **Recommendation reasons** explaining why products were suggested
- **Interaction buttons** (dismiss, feedback, purchase)
- **Loading and empty states**

**Usage:**
```tsx
<AIProductRecommendations
  context="workout_planning"
  limit={4}
  title="Recommended for You"
  autoGenerate={true}
/>
```

#### 3. Recommendations Page (`src/pages/Recommendations.tsx`)

A dedicated page for viewing all personalized recommendations with:
- **User insights** showing workout profile and goals
- **Tabbed interface** for different recommendation contexts
- **Comprehensive recommendation display**

## How It Works

### 1. Data Collection

The system collects:
- **Workout History**: Last 30 days of completed workouts
  - Workout types (strength, cardio, yoga, etc.)
  - Frequency and duration
  - Intensity levels
  - Equipment used

- **User Goals**: From profile and active goals
  - Primary fitness goals
  - Goal progress tracking
  - Goal priorities

### 2. AI Analysis

The recommendation engine uses a sophisticated scoring algorithm:

**Goal-Based Scoring:**
- Strength/Muscle goals → Equipment and protein supplements
- Weight loss → Cardio equipment and fat-burning supplements
- Endurance → Cardio-focused products
- Flexibility → Yoga and stretching equipment

**Workout-Based Scoring:**
- Frequent strength training → Weight equipment recommendations
- Home workouts → Portable and space-saving products
- High-intensity workouts → Recovery products

**Context-Based Scoring:**
- `workout_planning` → Equipment recommendations
- `post_workout` → Recovery products
- `goal_based` → Products aligned with specific goals

### 3. Product Matching

Each product is scored based on:
1. **Category alignment** with user goals
2. **Tag matching** with workout types
3. **Quality indicators** (ratings, reviews, featured status)
4. **Multi-factor bonuses** for high-relevance items

### 4. Recommendation Display

- Recommendations are ordered by confidence score
- Only active, non-dismissed products are shown
- Users can provide feedback to improve future recommendations

## Integration Points

### Current Integrations

1. **Dashboard** (`src/pages/Index.tsx`)
   - Shows general recommendations on the main dashboard
   - Context: `general`

2. **Workout Planning** (`src/pages/features/WorkoutPlanning.tsx`)
   - Shows equipment recommendations
   - Context: `workout_planning`

3. **Recommendations Page** (`src/pages/Recommendations.tsx`)
   - Comprehensive view of all recommendations
   - Multiple contexts available via tabs

4. **Navigation** (`src/components/FitMateHeader.tsx`)
   - Added "AI Recommendations" link in user menu

### Adding Recommendations to Other Pages

To add recommendations to any page:

```tsx
import { AIProductRecommendations } from "@/components/shop/AIProductRecommendations";

// In your component:
<AIProductRecommendations
  context="your_context" // e.g., "nutrition", "recovery"
  limit={4}
  title="Recommended Products"
  autoGenerate={true}
/>
```

## Database Migration

Run the migration to create the necessary tables:

```bash
supabase db push
```

Or manually run:
```sql
-- See: supabase/migrations/20250115000000_product_recommendations_engine.sql
```

## Configuration

### Recommendation Contexts

Available contexts:
- `general` - General recommendations based on overall profile
- `workout_planning` - Equipment for planning workouts
- `post_workout` - Recovery and post-workout products
- `goal_based` - Products aligned with specific goals
- Custom contexts can be added as needed

### Scoring Weights

The scoring algorithm uses weights (can be adjusted in `useProductRecommendations.tsx`):
- Goal alignment: 30 points
- Workout type match: 25 points
- Context relevance: 20 points
- Quality indicators: 10-15 points
- Multi-factor bonus: 10 points

Total maximum: 100 points

## Future Enhancements

### Planned Features

1. **OpenAI Integration**
   - Use GPT-4 for more sophisticated recommendation reasoning
   - Natural language recommendation explanations
   - Context-aware product descriptions

2. **Machine Learning**
   - Learn from user feedback
   - Collaborative filtering
   - Personalized scoring weights

3. **Advanced Analytics**
   - Recommendation performance metrics
   - Conversion tracking
   - A/B testing support

4. **Real-time Updates**
   - Live recommendation refresh
   - Event-driven updates
   - WebSocket support

### Integration with External AI Services

To integrate OpenAI or other AI services:

1. Add API key to environment variables:
```env
VITE_OPENAI_API_KEY=your_key_here
```

2. Update `generateRecommendationsWithAI` function in `useProductRecommendations.tsx`:

```tsx
async function generateRecommendationsWithAI(
  userId: string,
  products: any[],
  workoutAnalysis: UserWorkoutAnalysis | null,
  goalAnalysis: UserGoalAnalysis | null,
  context: string
) {
  // Call OpenAI API
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY
  });

  // Generate recommendations using GPT-4
  // ...
}
```

## Testing

### Manual Testing

1. **Create test user** with workout history and goals
2. **Generate recommendations** via the recommendations page
3. **Verify scoring** - check that relevant products appear first
4. **Test interactions** - click, dismiss, provide feedback
5. **Check persistence** - recommendations should persist in database

### Test Scenarios

1. **New User** - Should see general recommendations
2. **Active User** - Should see workout-specific recommendations
3. **Goal-Focused User** - Should see goal-aligned products
4. **Dismissed Items** - Should not reappear
5. **Feedback Impact** - Should affect future recommendations

## Performance Considerations

- **Caching**: Recommendations are cached for 24 hours
- **Lazy Loading**: Recommendations load only when needed
- **Pagination**: Large result sets are paginated
- **Database Indexes**: Optimized for fast queries

## Troubleshooting

### No Recommendations Showing

1. Check if user has workout history or goals
2. Verify products exist in `affiliate_products` table
3. Check database connection
4. Review console for errors

### Recommendations Not Relevant

1. Verify workout analysis is working correctly
2. Check goal alignment scoring
3. Review product tags and categories
4. Consider adjusting scoring weights

### Performance Issues

1. Check database query performance
2. Review indexes on recommendation tables
3. Consider caching strategy
4. Optimize product scoring algorithm

## API Reference

### `useProductRecommendations` Hook

**Props:**
- `context?: string` - Recommendation context
- `limit?: number` - Maximum number of recommendations
- `autoGenerate?: boolean` - Auto-generate if none exist

**Returns:**
- `recommendations: ProductRecommendation[]` - Array of recommendations
- `loading: boolean` - Loading state
- `generating: boolean` - Generation in progress
- `workoutAnalysis: UserWorkoutAnalysis | null` - Workout analysis results
- `goalAnalysis: UserGoalAnalysis | null` - Goal analysis results
- `generateRecommendations: (force?: boolean) => Promise<void>` - Generate recommendations
- `loadRecommendations: () => Promise<void>` - Load from database
- `trackInteraction: (id, type) => Promise<void>` - Track user interaction
- `provideFeedback: (id, type, text?) => Promise<void>` - Provide feedback
- `refresh: () => Promise<void>` - Refresh recommendations

## License

This implementation is part of FitMatePro and follows the project's license.



