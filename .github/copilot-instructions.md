# Splits Fitness & Nutrition - AI Coding Agent Instructions

## Project Overview
React Native fitness/nutrition tracker built with Expo (SDK ~52.0). Privacy-first architecture using 100% local storage (AsyncStorage). No backend, no API calls, no data collection. **Designed with Strong App-inspired UI** - minimal, clean, focused on functionality.

**Key Dependencies**: `@react-navigation/bottom-tabs`, `expo-notifications`, `react-native-chart-kit`, `expo-clipboard`, `expo-av` (video)

## Architecture & Data Flow

### Theme System (`src/context/ThemeContext.js`)
- **Dark/Light mode support**: ThemeProvider wraps entire app in `App.js`
- **Usage pattern**: `const { theme, isDark, toggleTheme } = useTheme()` in any component
- **Dynamic styles**: All screens use `createStyles(theme)` function pattern for theme-aware styling
- **Colors**: Access via `theme.colors.background`, `theme.colors.primary`, etc.
- **Persistence**: Theme preference saved to `@theme_preference` AsyncStorage key

### Storage Layer (`src/services/storage.js`)
- **Single source of truth**: All data operations go through `StorageService`
- **Keys**: `@workouts`, `@workout_templates`, `@nutrition_data`, `@progress_data`, `@settings`, `@templates_initialized`, `@personal_records`
- **Pattern**: Each method handles serialization/deserialization. Always wrap AsyncStorage calls in try/catch
- **Progress entries**: Generated from workouts via `generateProgressEntry()` in `utils/helpers.js` and saved separately
- **Personal Records (PRs)**: Tracked per exercise with `maxWeight` and `maxVolume` sub-objects

### Screen Architecture
Bottom tab navigation (`@react-navigation/bottom-tabs`) with 6 main screens in `AppNavigator.js`:
- **WorkoutsScreen**: Active workout creation + history list. Features Strong App-style set tracking with Previous/Reps/Weight columns, PR badges, plate calculator integration. Main state: `currentWorkout` (null when viewing history, object when active)
- **TemplatesScreen**: Import/export via JSON + Clipboard API. Default templates initialized once on first load via `@templates_initialized` flag
- **ProgressScreen**: Charts use `react-native-chart-kit` with Bezier line charts. Data aggregated from `@progress_data` AsyncStorage key
- **NutritionScreen**: Daily meal logging with date navigation. Macros calculated client-side with progress bars for P/C/F
- **PremiumScreen**: Demo premium features (non-functional purchase flow). Uses `isPremium` local state
- **SettingsScreen**: Theme toggle, app preferences, data management (clear data, reset defaults)

**Navigation pattern**: All tabs configured with theme-aware styles in `screenOptions`. Icons from `@expo/vector-icons/Ionicons` with filled/outline variants.

### Exercise Database (`src/data/exercises.js`)
- Array of exercise objects with `alternatives` array containing IDs of similar exercises
- Structure: `{ id, name, category, muscleGroups, equipment, videoUrl, thumbnailUrl, alternatives: [ids], isPremium }`
- Alternative exercises linked via IDs - look up by `exercises.find(e => e.id === altId)`

### Data Structures
**Workout Object**:
```javascript
{
  id: string,          // Generated via generateId()
  name: string,        // User-defined workout name
  date: string,        // ISO string: new Date().toISOString()
  exercises: [{
    id: string,
    exerciseId: string,  // References exercises.js
    sets: [{ id, reps, weight, completed: boolean }],
    notes: string
  }],
  completed: boolean
}
```

**Template Object** (`src/data/workoutTemplates.js`):
```javascript
{
  id: string,
  name: string,
  description: string,
  difficulty: 'Beginner'|'Intermediate'|'Advanced',
  duration: string,    // e.g., "45-60 min"
  frequency: string,   // e.g., "3x per week"
  isPremium: boolean,
  exercises: [{ exerciseId, sets, reps }]
}
```

**Progress Entry**:
```javascript
{
  date: string,        // ISO string
  exerciseId: string,
  maxWeight: number,
  totalVolume: number  // sum of (weight * reps) for all completed sets
}
```

**Personal Record**:
```javascript
{
  [exerciseId]: {
    maxWeight: { weight, reps, date },
    maxVolume: { volume, date }
  }
}
```

## Critical Workflows

### Development Commands
```bash
npm start          # Start Expo dev server (choose platform from menu)
npm run android    # Android device/emulator (requires Android Studio)
npm run ios        # iOS device/simulator (macOS only, requires Xcode)
npm run web        # Web browser (limited mobile API support)
```

### Testing Push Notifications
Rest timer notifications require physical device or emulator:
1. Permissions requested in `App.js` via `requestNotificationPermissions()` on mount
2. Android: Notification channel `'rest-timer'` created in `utils/notifications.js` with HIGH importance
3. iOS: Permissions dialog appears automatically on first launch
4. **Critical**: Web doesn't support push notifications - test on device only
5. Notification triggered after completing sets in WorkoutsScreen via `scheduleRestTimerNotification(seconds)`

### Building for Production
```bash
# EAS Build (configured in eas.json with 3 profiles)
eas build --platform android --profile production  # Auto-increment version
eas build --platform ios --profile production
eas build --platform all --profile preview         # Internal testing
```

### Helper Functions (`utils/helpers.js`)
Core utilities used across the app:
- `generateId()`: Creates unique IDs via `Date.now().toString(36) + Math.random().toString(36).substring(2)`
- `formatDate(date)`: Returns "Jan 15, 2026" format for workout/progress display
- `formatTime(date)`: Returns "03:45 PM" format
- `calculateTotalVolume(exercises)`: Sums `weight * reps` for completed sets
- `calculateMaxWeight(exercises)`: Finds highest weight lifted in workout
- `generateProgressEntry(workout, exerciseId)`: Creates progress data point from workout for charts

## Project-Specific Conventions

### Theme-Aware Styling Pattern
Always use the function pattern for styles:
```javascript
const createStyles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    // ...
  }
});
// Then in component:
const { theme } = useTheme();
const styles = createStyles(theme);
```

### ID Generation
Always use `generateId()` from `utils/helpers.js` - returns `Date.now().toString(36) + Math.random().toString(36).substring(2)`

### Modal Patterns
Most screens use controlled modals:
```javascript
const [showModal, setShowModal] = useState(false);
// Modal visible={showModal} onClose={() => setShowModal(false)}
```

### Exercise Set Management
Sets stored as arrays with `{ id, reps, weight, completed }` structure. Always maintain set IDs for keying FlatLists.

### Data Persistence Pattern
1. Update local state immediately for UI responsiveness
2. Persist to AsyncStorage via StorageService
3. No loading states needed - AsyncStorage is fast enough for local data

### Progress Entry Creation
When saving workouts, loop through exercises and call:
```javascript
const progressEntry = generateProgressEntry(workout, exercise.exerciseId);
await StorageService.saveProgressEntry(progressEntry);
```

### Personal Record Tracking
After completing a set, check and update PRs:
```javascript
await StorageService.updatePersonalRecord(exerciseId, weight, reps, date);
// Automatically handles maxWeight and maxVolume comparison
```

### Template Import/Export
Templates are JSON objects. Import validates structure before saving:
```javascript
// Required fields: id, name, description, exercises[]
// exercises[] must have: exerciseId, sets, reps
```

## Component Integration

### ThemeContext Integration
All new components MUST integrate theme support:
```javascript
import { useTheme } from '../context/ThemeContext';
// Inside component:
const { theme, isDark, toggleTheme } = useTheme();
const styles = createStyles(theme);
```

### RestTimer Component
- Self-contained modal component with countdown logic
- Auto-triggers after marking sets complete in WorkoutsScreen
- Uses Animated API for progress bar
- Schedules push notification via `scheduleRestTimerNotification(seconds)`
- Now theme-aware with dark mode support

### PlateCalculator Component
- Modal calculator for barbell plate loading
- Supports lbs/kg unit toggle
- Calculates optimal plate distribution per side
- Integrates with WorkoutsScreen set inputs via calculator icon button
- Returns selected weight to parent via `onSelectWeight` callback
- Algorithm: Greedy approach starting with 45lb/20kg plates down to 2.5lb/1.25kg

### ExerciseVideoModal Component
- Plays YouTube videos via expo-av VideoPlayer
- Opened by tapping info icon next to exercise names
- Pass `exercise` object with `videoUrl` property
- URLs must be direct YouTube links, thumbnails auto-generated from video ID

## Common Pitfalls

1. **Don't fetch from backend**: All data is local. No network calls anywhere
2. **AsyncStorage is async**: Always await StorageService methods
3. **Date handling**: Store dates as ISO strings (`new Date().toISOString()`), parse with `new Date(dateString)`
4. **Exercise alternatives**: Must exist in exercises array - don't create dangling references
5. **Template initialization**: Check `@templates_initialized` flag to avoid duplicate default templates
6. **Progress data duplication**: Each workout creates separate progress entries per exercise
7. **Modal state**: Always reset input fields when closing modals to prevent stale data
8. **Theme awareness**: All new components and screens MUST use `useTheme()` hook and dynamic styling
9. **PR alerts**: Only show when weight is actually higher than existing PR, not just on every set completion
10. **FlatList keys**: Always use `id` field for `keyExtractor`, never use array indices
11. **Notification permissions**: Must be requested on app mount, stored state in App.js useEffect
12. **Video URLs**: Must be direct YouTube links for expo-av, not embed URLs

## Styling Approach - Strong App Inspired
- Function-based styles with theme parameter: `const createStyles = (theme) => StyleSheet.create({...})`
- Color scheme: Access via theme.colors (primary, background, card, text, textSecondary, border, etc.)
- Dark mode: Deep dark backgrounds (`#0A0E17`), card elevation with borders, subtle contrasts
- Light mode: Clean white/gray palette with subtle shadows
- No external UI library - all custom components using React Native primitives
- Icons via `@expo/vector-icons` (Ionicons)
- Minimalist approach: Remove unnecessary decorations, focus on content and functionality
- Strong App patterns:
  - Set table layout with SET/PREVIOUS/REPS/WEIGHT columns
  - PR badges prominently displayed
  - Large touch targets (48px minimum)
  - Clean card-based layouts with proper spacing
  - Subtle borders instead of heavy shadows

## TypeScript
Minimal TS usage: Only `src/types/index.ts` exists but most code is `.js`. When adding types, define in `types/index.ts` and import.

## New Features Summary
- **Dark Mode**: Full theme system with light/dark variants
- **Personal Records**: Automatic PR tracking and celebration alerts
- **Plate Calculator**: Barbell loading calculator with plate distribution
- **UI Overhaul**: Strong App-inspired minimalist design
- **Settings Screen**: Theme toggle and app configuration

## Deep Dive: Critical Systems

### Exercise Alternatives System
**Location**: `WorkoutsScreen.js` + `exercises.js`

**How it works**:
1. Each exercise in `exercises.js` has an `alternatives` array with IDs of similar exercises
2. UI shows swap icon (`swap-horizontal`) next to each exercise in active workout
3. Tapping icon calls `suggestAlternative(exerciseId)` function
4. Function looks up exercise, finds alternatives by ID: `exercise.alternatives.map(altId => exercises.find(e => e.id === altId))`
5. Displays Alert dialog with alternative exercise names separated by newlines

**Implementation pattern**:
```javascript
const suggestAlternative = (exerciseId) => {
  const exercise = exercises.find(e => e.id === exerciseId);
  if (exercise && exercise.alternatives && exercise.alternatives.length > 0) {
    const alternatives = exercise.alternatives
      .map(altId => exercises.find(e => e.id === altId))
      .filter(e => e);  // Remove any undefined results
    const altNames = alternatives.map(e => e.name).join('\n');
    Alert.alert('Exercise Alternatives', `Alternative exercises for ${exercise.name}:\n\n${altNames}`);
  }
};
```

**Key points**:
- Alternatives must reference valid exercise IDs in the same array
- No UI for swapping - just displays suggestions via Alert dialog
- Used for suggesting similar movements when equipment unavailable or preference change

### Progress Charts Logic
**Location**: `ProgressScreen.js` + `storage.js`

**Data Flow**:
1. **Progress Entry Creation**: When workout is saved, `generateProgressEntry()` creates entry per exercise:
   ```javascript
   {
     date: workout.date,           // ISO string
     exerciseId: exerciseId,
     maxWeight: calculateMaxWeight([workoutExercise]),  // Highest weight in that workout
     totalVolume: calculateTotalVolume([workoutExercise]) // Sum of weight × reps for completed sets
   }
   ```

2. **Storage**: All progress entries stored in single `@progress_data` array, filtered by exerciseId on read

3. **Chart Data Preparation** (`prepareChartData` function):
   - Fetches all progress for selected exercise: `StorageService.getProgressForExercise(exerciseId)`
   - Sorts by date ascending
   - Takes last 10 entries: `exerciseProgress.slice(-10)`
   - Formats labels as "M/D": `${date.getMonth() + 1}/${date.getDate()}`
   - Returns data structure for `react-native-chart-kit`:
     ```javascript
     {
       labels: ['1/10', '1/12', '1/15', ...],  // Last 10 dates
       datasets: [{
         data: [135, 140, 145, ...],           // maxWeight or totalVolume values
         color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
         strokeWidth: 2
       }]
     }
     ```

4. **Two charts rendered**: Max Weight Progress (strength) and Total Volume Progress (workload)

5. **Progress Calculation**: Compares first vs last entry to show improvement %
   ```javascript
   const weightPercent = first.maxWeight > 0 
     ? ((last.maxWeight - first.maxWeight) / first.maxWeight * 100) 
     : 0;
   ```

**Critical behavior**:
- Progress data never deleted when workouts deleted (intentional - keeps historical records)
- Each workout completion creates NEW entries (duplicates allowed by date+exerciseId)
- Charts automatically filter to selected exercise via dropdown

### Template Import/Export Flow
**Location**: `TemplatesScreen.js` + `storage.js`

**Export Process**:
1. **Single Template Export**:
   - Converts template object to JSON: `JSON.stringify([template], null, 2)` (array format for consistency)
   - First tries React Native Share API: `Share.share({ message: json, title: 'Export Template' })`
   - If share fails (e.g., web), falls back to clipboard: `Clipboard.setStringAsync(json)`
   - User can paste into notes, messages, etc.

2. **Export All Templates**:
   - Calls `StorageService.exportTemplates()` which gets all templates and stringifies them
   - Same share/clipboard fallback pattern
   - Format: JSON array of template objects

**Import Process**:
1. User opens import modal, pastes JSON text
2. Optional: "Paste from Clipboard" button auto-fills via `Clipboard.getStringAsync()`
3. Calls `StorageService.importTemplates(jsonText)`:
   ```javascript
   const newTemplates = JSON.parse(jsonText);  // Parse JSON
   const existingTemplates = await this.getTemplates();
   
   // Deduplicate by ID
   const existingIds = new Set(existingTemplates.map(t => t.id));
   const uniqueNewTemplates = newTemplates.filter(t => !existingIds.has(t.id));
   
   // Merge and save
   const merged = [...existingTemplates, ...uniqueNewTemplates];
   await AsyncStorage.setItem(KEYS.TEMPLATES, JSON.stringify(merged));
   ```

4. **Validation**: Wrapped in try/catch - invalid JSON shows Alert error
5. **Required fields**: `id`, `name`, `description`, `exercises[]` with `exerciseId`, `sets`, `reps`

**Template Schema**:
```javascript
{
  id: "unique-id-12345",
  name: "Push Day",
  description: "Chest, shoulders, triceps",
  difficulty: "Intermediate",    // Optional
  duration: "60-75 min",          // Optional
  frequency: "2x per week",       // Optional
  isPremium: false,               // Optional
  exercises: [
    { exerciseId: "bench-press", sets: 4, reps: 8 },
    { exerciseId: "overhead-press", sets: 3, reps: 10 }
  ]
}
```

**Cross-platform compatibility**:
- Share API works on iOS/Android (native share sheet)
- Clipboard works everywhere including web
- JSON format platform-agnostic

### Building for Google Play Console
**Key files**: `eas.json`, `app.json`, `docs/google-play-listing.md`

**Build Process**:
1. **EAS Build** generates Android App Bundle (.aab file):
   ```bash
   eas build --platform android --profile production
   ```
   - Profile `production` has `autoIncrement: true` - auto-bumps version number
   - Generates `.aab` file compatible with Google Play
   - Required API level: 35 (targetSdkVersion in build)

2. **Download .aab**: After build completes, download from Expo dashboard or via CLI

3. **Upload to Google Play Console**:
   - Navigate to Production track > Create new release
   - Upload `.aab` file (NOT .apk)
   - Google Play signs with app signing key

**Critical Data Safety Declaration**:
- Google requires "Data Safety" form completion
- **This app collects ZERO data** - all storage is local AsyncStorage
- Form answers:
  - "Does your app collect or share user data?" → **No**
  - No analytics, no backend, no third-party SDKs with tracking
  - Privacy policy URL still required (hosted at domain or GitHub Pages)
- **EEA Compliance**: See `docs/eea-compliance.md` for full GDPR compliance documentation
- **iOS Privacy Labels**: Configured in app.json infoPlist with clear "no tracking" statements

**Store Listing Requirements** (from `google-play-listing.md`):
- App icon: 512×512 PNG with transparency
- Feature graphic: 1024×500 JPEG/PNG (banner image)
- Screenshots: Minimum 2, recommended 4-8 (phone screenshots from real device)
- Short description: ≤80 characters
- Full description: ≤4000 characters
- Contact email: Real support email address
- Privacy policy URL: Must be publicly hosted before submission

**Release Process**:
1. Complete store listing content
2. Build .aab with `eas build`
3. Upload to Production track
4. Complete Content Rating questionnaire
5. Complete Data Safety form (declare no data collection)
6. Submit for review (1-7 days typically)

**Note**: No separate .aab signing needed - EAS Build + Google Play signing handles this automatically

## Project-Specific Edge Cases
- **PremiumScreen**: Demo-only purchase flow with local `isPremium` state toggle - no actual payment processing
- **Template sharing**: Uses React Native Share API + Clipboard - both methods must be supported for cross-platform compatibility
- **Workout state**: `currentWorkout` is null when viewing history, object when active session in progress
- **Exercise video player**: Requires expo-av VideoPlayer, not WebView or YouTube iframe
- **Progress data**: Generated from completed workouts, not entered directly - calculated via helper functions
- **Notification channel**: Android-specific requirement, iOS uses system-level notification settings
