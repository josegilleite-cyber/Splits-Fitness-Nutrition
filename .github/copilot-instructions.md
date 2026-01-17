# Splits Fitness & Nutrition - AI Coding Agent Instructions

## Project Overview
React Native fitness/nutrition tracker built with Expo. Privacy-first architecture using 100% local storage (AsyncStorage). No backend, no API calls, no data collection. **Designed with Strong App-inspired UI** - minimal, clean, focused on functionality.

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
Bottom tab navigation with 5 main screens:
- **WorkoutsScreen**: Active workout creation + history list. Features Strong App-style set tracking with Previous/Reps/Weight columns, PR badges, plate calculator integration
- **TemplatesScreen**: Import/export via JSON + Clipboard API. Default templates initialized once on first load
- **ProgressScreen**: Charts use `react-native-chart-kit`. Data aggregated from `@progress_data` AsyncStorage key
- **NutritionScreen**: Daily meal logging with date navigation. Macros calculated client-side
- **SettingsScreen**: Theme toggle, app preferences, data management

### Exercise Database (`src/data/exercises.js`)
- Array of exercise objects with `alternatives` array containing IDs of similar exercises
- Structure: `{ id, name, category, muscleGroups, equipment, videoUrl, thumbnailUrl, alternatives: [ids], isPremium }`
- Alternative exercises linked via IDs - look up by `exercises.find(e => e.id === altId)`

## Critical Workflows

### Development Commands
```bash
npm start          # Start Expo dev server
npm run android    # Android device/emulator
npm run ios        # iOS device/simulator
npm run web        # Web browser
```

### Testing Push Notifications
Rest timer notifications require:
1. Physical device or emulator with notification support
2. Permissions requested in `App.js` via `requestNotificationPermissions()`
3. Android: Channel created in `utils/notifications.js` named 'rest-timer'
4. Test on device; web doesn't support push notifications

### Building for Production
```bash
# Use EAS Build (configured in eas.json)
eas build --platform android --profile production
eas build --platform ios --profile production
```

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

### ExerciseVideoModal Component
- Plays YouTube videos via expo-av VideoPlayer
- Opened by tapping info icon next to exercise names
- Pass `exercise` object with `videoUrl` property

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
