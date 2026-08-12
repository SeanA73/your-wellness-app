# Testing the AI Product Recommendation Engine

## Quick Start

The app should now be running. Here's how to test the recommendation engine:

## 1. Access the App

The development server should be running. Open your browser and navigate to:
```
http://localhost:5173
```

## 2. Prerequisites

Before testing recommendations, ensure:

1. **Database Migration is Applied**
   - The migration file is at: `supabase/migrations/20250115000000_product_recommendations_engine.sql`
   - Apply it using: `supabase db push` or manually in Supabase dashboard

2. **You're Logged In**
   - Create an account or sign in
   - Complete onboarding if prompted

3. **You Have Some Data**
   - Workout history (at least one completed workout session)
   - OR Fitness goals set in your profile

## 3. Testing Steps

### Test 1: View Recommendations on Dashboard

1. Navigate to the home page (dashboard)
2. Scroll down to see the "Recommended for You" section
3. If you have workout history/goals, recommendations should appear automatically
4. If not, click "Get Recommendations" button

### Test 2: Dedicated Recommendations Page

1. Click on your profile avatar in the header
2. Select "AI Recommendations" from the dropdown menu
3. You should see:
   - Your workout profile (if you have workouts)
   - Your goals (if set)
   - Recommendations organized by context (All, Workout, Goals, Recovery)

### Test 3: Context-Specific Recommendations

1. Go to `/features/workout-planning`
2. Scroll down to see "Recommended Workout Equipment" section
3. Recommendations should be filtered for workout context

### Test 4: Generate New Recommendations

1. On the Recommendations page (`/recommendations`)
2. Click the refresh button (circular arrow icon) or "Refresh recommendations" link
3. New recommendations should be generated based on your latest data

### Test 5: Interact with Recommendations

1. **Click a product**: Opens affiliate link (should track click)
2. **Dismiss a product**: Click the X button on a product card
3. **Provide feedback**: Click the thumbs down icon → select feedback type
4. **View confidence score**: See the percentage match indicator

## 4. What to Look For

### ✅ Success Indicators

- Recommendations appear based on your workout types
- Product categories match your goals (e.g., strength goals → equipment)
- Confidence scores are displayed
- Recommendation reasons are shown ("Perfect for building strength...")
- Dismissed items disappear from view
- Feedback buttons work

### 🔍 Verification Points

1. **Workout Analysis**
   - If you have workout history, check the "Your Workout Profile" card
   - Should show: Total workouts, Primary types, Frequency, Intensity

2. **Goal Analysis**
   - Check the "Your Goals" card
   - Should show your primary goal and active goals

3. **Product Matching**
   - Strength training → Should see weight equipment, resistance bands
   - Cardio workouts → Should see cardio equipment
   - Yoga/flexibility → Should see yoga mats, stretching equipment
   - Weight loss goals → Should see relevant supplements/equipment

## 5. Troubleshooting

### No Recommendations Showing

**Possible causes:**
1. **No workout history or goals**
   - Solution: Add a workout session or set goals in your profile
   
2. **Database migration not applied**
   - Solution: Run `supabase db push`
   
3. **No products in database**
   - Solution: Check `affiliate_products` table has data (sample products should exist)

4. **Recommendations not generated yet**
   - Solution: Click "Get Recommendations" or "Refresh recommendations"

### Recommendations Not Relevant

1. **Check your workout types**
   - Recommendations are based on your actual workout patterns
   - Add more diverse workouts to get varied recommendations

2. **Verify your goals**
   - Go to Profile → Ensure fitness goals are set correctly

3. **Check product tags**
   - Products need proper tags and categories in the database

### Errors in Console

1. **Database connection error**
   - Check Supabase credentials in `.env`
   - Verify database is accessible

2. **Type errors**
   - Run `npm run build` to check for TypeScript errors
   - All files should compile without errors

3. **Missing tables**
   - Ensure migration was applied successfully
   - Check Supabase dashboard for `product_recommendations` table

## 6. Testing Different Scenarios

### Scenario 1: New User (No Data)
- Should see general recommendations
- Or prompt to add workouts/goals

### Scenario 2: Active User (With Workouts)
- Should see workout-specific recommendations
- Recommendations should match workout types

### Scenario 3: Goal-Focused User
- Should see goal-aligned products
- Products should match primary goal

### Scenario 4: Dismissed Items
- Dismissed items should not reappear
- Other recommendations should still show

### Scenario 5: Multiple Contexts
- Different contexts should show different products
- Workout planning → Equipment
- Post-workout → Recovery products

## 7. Database Verification

Check in Supabase dashboard:

```sql
-- Check if recommendations table exists
SELECT * FROM product_recommendations LIMIT 5;

-- Check recommendation generation history
SELECT * FROM recommendation_generations ORDER BY created_at DESC LIMIT 5;

-- Check user feedback
SELECT * FROM recommendation_feedback LIMIT 5;

-- Check active products
SELECT COUNT(*) FROM affiliate_products WHERE is_active = true;
```

## 8. Performance Testing

1. **Load time**: Recommendations should load within 2-3 seconds
2. **Generation time**: Initial generation should complete within 5-10 seconds
3. **Refresh**: Refreshing should be fast (uses cached recommendations)
4. **Multiple contexts**: Switching between contexts should be smooth

## 9. UI/UX Testing

### Visual Checks
- ✅ Product cards display correctly
- ✅ Images load properly
- ✅ Confidence scores visible
- ✅ Recommendation reasons readable
- ✅ Buttons are clickable
- ✅ Loading states show during generation

### Responsive Design
- Test on mobile viewport
- Test on tablet viewport
- Test on desktop viewport

### Accessibility
- All buttons should be keyboard navigable
- Images should have alt text
- Color contrast should be sufficient

## 10. Next Steps

After successful testing:

1. **Monitor Performance**
   - Check database query times
   - Monitor recommendation generation speed

2. **Collect Feedback**
   - Use the feedback system
   - Note which recommendations are most relevant

3. **Enhance Scoring**
   - Adjust weights in `useProductRecommendations.tsx`
   - Fine-tune based on user feedback

4. **Add More Products**
   - Populate `affiliate_products` table with more items
   - Ensure products have proper tags and categories

5. **Integrate External AI**
   - Optional: Add OpenAI GPT-4 for more sophisticated reasoning
   - See documentation in `PRODUCT_RECOMMENDATIONS_ENGINE.md`

## Support

If you encounter issues:

1. Check browser console for errors
2. Check Supabase logs for database errors
3. Verify all migrations are applied
4. Ensure environment variables are set correctly

For more details, see `PRODUCT_RECOMMENDATIONS_ENGINE.md`



