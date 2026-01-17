# User Guide - Splits Fitness & Nutrition

## Getting Started

When you first open the app, you'll see four main tabs at the bottom:
1. **Workouts** - Track your gym sessions
2. **Nutrition** - Log meals and track macros
3. **Progress** - View your strength gains over time
4. **Templates** - Create and manage workout programs

---

## 🏋️ Workouts Tab

### Starting a Workout
1. Tap the blue **+** button in the bottom right
2. Enter a workout name (e.g., "Push Day", "Chest & Triceps")
3. Tap **Start**

### Adding Exercises
1. Tap the **+** icon in the top right
2. Browse the exercise list or scroll to find an exercise
3. Tap an exercise to add it to your workout
4. Each exercise starts with 3 sets of 10 reps

### Logging Sets
1. Enter the number of reps you completed
2. Enter the weight you used (in lbs)
3. Tap the checkmark ✓ to mark the set as complete
4. A rest timer will automatically appear

### Rest Timer
- When you complete a set, the rest timer appears
- Choose from 60s, 90s, 120s, or 180s presets
- Tap **Start** to begin countdown
- You'll receive a notification when rest is complete
- Tap **Pause** to pause or **Reset** to start over

### Exercise Alternatives
- Tap the swap icon (⇄) next to any exercise
- View a list of alternative exercises that work similar muscles
- Great for when equipment is unavailable or you want variety

### Completing a Workout
1. When finished, tap **Complete Workout**
2. Your workout is saved automatically
3. Progress data is recorded for all exercises

---

## 🍎 Nutrition Tab

### Logging a Meal
1. Tap the green **+** button
2. Enter a meal name (e.g., "Breakfast", "Post-Workout")
3. Tap **Next**

### Adding Foods
1. Enter the food name
2. Enter serving size and unit (g, oz, cup, etc.)
3. Enter calories (required)
4. Optionally enter protein, carbs, and fats in grams
5. Tap **+ Add Another Food** to add more items
6. Tap **Save Meal** when done

### Viewing Daily Summary
- The top card shows your total calories for the day
- View protein, carbs, and fats with progress bars
- Default goals: 200g protein, 300g carbs, 70g fats

### Navigating Dates
- Use the arrows ← → at the top to view different days
- Each day's meals are stored separately
- View historical nutrition data anytime

---

## 📊 Progress Tab

### Viewing Progress Charts
1. Tap the exercise dropdown at the top
2. Select an exercise you've tracked
3. View two charts:
   - **Max Weight Progress** - Heaviest weight lifted over time
   - **Total Volume Progress** - Total weight × reps over time

### Understanding Statistics
- **Total Workouts** - Number of times you've done this exercise
- **Max Weight** - Improvement in your heaviest lift
- **Total Volume** - Improvement in total work done
- Green numbers indicate positive progress

### Workout History
- Scroll down to see every workout with this exercise
- View max weight and total volume for each session
- Sorted from newest to oldest

---

## 📝 Templates Tab

### Using Default Templates
The app comes with three pre-configured templates:
- **Push Day** - Chest, shoulders, triceps
- **Pull Day** - Back, biceps
- **Leg Day** - Quadriceps, hamstrings, glutes, calves

Tap **Use Template** on any template to see the exercises.

### Creating a Custom Template
1. Tap the blue **+** button
2. Enter a template name and description
3. Tap **Next**
4. Browse and tap exercises to add them
5. Each exercise defaults to 3 sets × 10 reps
6. Tap the trash icon to remove exercises
7. Tap **Save** when done

### Exporting Templates
1. Tap the share icon on any template
2. Choose to share via messaging, email, etc., or copy to clipboard
3. The template is exported as JSON format

### Exporting All Templates
1. Tap **Export All** at the top
2. All your templates are exported as a single JSON file
3. Save this as a backup or share with friends

### Importing Templates
1. Tap **Import** at the top
2. Paste JSON data (either tap **Paste from Clipboard** or manually paste)
3. Tap **Import Templates**
4. New templates are added to your existing ones

---

## Privacy & Data

### Local Storage
- All data is stored locally on your device using AsyncStorage
- No data is sent to servers or the cloud
- No internet connection required to use the app
- Complete privacy and control over your data

### Backing Up Data
- Use the Templates import/export feature to backup templates
- For full data backup, use your device's backup system (iCloud, Google Drive)
- AsyncStorage data is included in device backups

---

## Tips & Tricks

1. **Progressive Overload** - Try to beat your previous numbers each workout
2. **Consistency** - Log workouts regularly to see meaningful progress charts
3. **Template Organization** - Create templates for different training splits
4. **Rest Timer Customization** - Use shorter rest for isolation exercises, longer for compounds
5. **Nutrition Goals** - Adjust your mental macro goals based on your fitness objectives
6. **Exercise Database** - Explore all 15 exercises in the database
7. **Volume Tracking** - Watch total volume to ensure you're increasing work over time

---

## Troubleshooting

**Notifications not working?**
- Check that notifications are enabled in your device settings
- Grant permission when the app first requests it

**Data not saving?**
- Make sure to tap "Complete Workout" or "Save Meal" to persist data
- Check that you have storage space on your device

**App not starting?**
- Try closing and reopening the app
- Ensure all dependencies are installed (`npm install`)
- Check that you're running a compatible version of Expo

---

## Feature Checklist

✅ Workout tracking with sets, reps, and weight  
✅ Rest timer with notifications (60s/90s/120s/180s)  
✅ Exercise replacement suggestions  
✅ Meal logging with macro calculations  
✅ Daily nutrition summary  
✅ Progress charts for strength gains  
✅ Workout history  
✅ Custom workout templates  
✅ Template import/export  
✅ 100% local storage  
✅ No data collection  

Enjoy your fitness journey! 💪
