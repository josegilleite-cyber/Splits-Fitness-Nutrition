
# Splits Fitness & Nutrition — Guía para Agentes de IA

## Arquitectura General
- **React Native + Expo** (SDK ~52): App móvil de fitness/nutrición, 100% local (sin backend, sin fetch/red).
- **Persistencia**: Todo pasa por `src/services/storage.js` (`StorageService`) usando AsyncStorage.
- **Navegación**: 6 pantallas principales en `src/navigation/AppNavigator.js` con `@react-navigation/bottom-tabs`.
- **Temas**: Soporte dark/light mode en `src/context/ThemeContext.js` y estilos dinámicos con `createStyles(theme)`.
- **Datos**: Ejercicios (`src/data/exercises.js`), plantillas (`src/data/workoutTemplates.js`), helpers (`src/utils/helpers.js`).
- **Componentes clave**: `RestTimer`, `PlateCalculator`, `ExerciseVideoModal` (`src/components/`).

## Convenciones y Patrones Específicos
- **Estilos**: Siempre usar función: `const styles = createStyles(theme);` y colores vía `theme.colors`.
- **IDs**: Generar con `generateId()` de `utils/helpers.js`.
- **Modales**: Controlados por estado local (`showModal`, `setShowModal`).
- **Gestión de sets**: Arrays `{ id, reps, weight, completed }`, usar `id` como key en FlatList.
- **Persistencia**: Actualizar estado local primero, luego persistir con `StorageService` (sin loading states).
- **PRs**: Usar `StorageService.updatePersonalRecord()` tras cada set completado (solo alerta si supera récord anterior).
- **Import/Export plantillas**: JSON, validación de estructura, deduplicación por `id`, soporte Share API y Clipboard.
- **No fetch/red**: Nunca agregar lógica de backend o llamadas externas.

## Flujos Críticos
- **Arranque**: `npm start` (Expo), `npm run android/ios/web` según plataforma.
- **Build producción**: `eas build --platform android --profile production` (ver `eas.json`).
- **Notificaciones**: Solo en dispositivo/emulador, permisos en `App.js`, canal Android en `utils/notifications.js`.
- **Charts de progreso**: Datos de `@progress_data`, renderizados con `react-native-chart-kit` en `ProgressScreen.js`.
- **Import/export plantillas**: Lógica en `TemplatesScreen.js` y `storage.js`.

## Ejemplos de Patrones
- **Personal Records (PRs)**: `StorageService.updatePersonalRecord(exerciseId, weight, reps, date)` tras set completado. Solo alerta si supera récord anterior. Ver lógica en `src/services/storage.js` y uso en `WorkoutsScreen.js`.
- **Plantillas**: Estructura mínima:
  ```js
  { id, name, description, exercises: [{ exerciseId, sets, reps }] }
  ```
  Import/export vía Share API o Clipboard. Deduplicación por `id`.
- **Theme-aware**: Todos los componentes nuevos deben usar `useTheme()` y `createStyles(theme)`.
- **Alternativas de ejercicio**: Sugeridas en `WorkoutsScreen.js` usando IDs válidos de `exercises.js`.
- **Creación de progreso**: `generateProgressEntry(workout, exercise.exerciseId)` y guardar con `StorageService.saveProgressEntry()`.

## Edge Cases y Errores Comunes
- No crear referencias de ejercicios inexistentes en `alternatives`.
- No duplicar plantillas por inicialización múltiple (`@templates_initialized`).
- No eliminar datos de progreso al borrar workouts (histórico intencional).
- URLs de video: solo enlaces directos de YouTube (no embeds).
- PRs: Solo mostrar alerta si el nuevo peso supera el récord anterior.

## Archivos Clave
- Navegación: `src/navigation/AppNavigator.js`
- Almacenamiento: `src/services/storage.js`
- Temas: `src/context/ThemeContext.js`
- Ejercicios: `src/data/exercises.js`
- Helpers: `src/utils/helpers.js`
- Pantallas: `src/screens/`
- Componentes: `src/components/`

---
¿Falta algún flujo, convención o edge case importante? Indícalo para mejorar la guía.
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

  # Splits Fitness & Nutrition — AI Coding Agent Guide

  ## Arquitectura y Flujos Clave
  - **React Native + Expo** (SDK ~52): App de fitness/nutrición, 100% local (AsyncStorage), sin backend ni llamadas de red.
  - **Navegación**: 6 pantallas principales en `src/navigation/AppNavigator.js` usando `@react-navigation/bottom-tabs`.
  - **Persistencia**: Toda la lógica de almacenamiento pasa por `src/services/storage.js` (`StorageService`).
  - **Temas**: Sistema de dark/light mode en `src/context/ThemeContext.js`, con estilos dinámicos vía `createStyles(theme)`.
  - **Datos**: Ejercicios en `src/data/exercises.js`, plantillas en `src/data/workoutTemplates.js`, helpers en `src/utils/helpers.js`.
  - **Componentes clave**: `RestTimer`, `PlateCalculator`, `ExerciseVideoModal` (todos en `src/components/`).

  ## Convenciones Específicas
  - **Estilos**: Siempre usar patrón función: `const styles = createStyles(theme);` y acceder a colores vía `theme.colors`.
  - **IDs**: Generar con `generateId()` de `utils/helpers.js`.
  - **Modales**: Controlados por estado local (`showModal`, `setShowModal`).
  - **Gestión de sets**: Arrays de `{ id, reps, weight, completed }`, usar `id` como key en FlatList.
  - **Persistencia**: Actualizar estado local primero, luego persistir con `StorageService` (no loading states).
  - **PRs**: Actualizar con `StorageService.updatePersonalRecord()` tras cada set completado.
  - **Import/Export plantillas**: JSON, validación de estructura, soporte Share API y Clipboard.
  - **No fetch/red**: Nunca agregar lógica de backend o llamadas externas.

  ## Flujos Críticos de Desarrollo
  - **Arranque**: `npm start` (Expo), `npm run android/ios/web` según plataforma.
  - **Build producción**: `eas build --platform android --profile production` (ver `eas.json`).
  - **Notificaciones**: Solo en dispositivo/emulador, permisos en `App.js`, canal Android en `utils/notifications.js`.
  - **Charts de progreso**: Datos de `@progress_data`, renderizados con `react-native-chart-kit` en `ProgressScreen.js`.
  - **Import/export plantillas**: Ver lógica en `TemplatesScreen.js` y `storage.js`.

  ## Ejemplos de Patrones
  ## Lógica de Personal Records (PRs)
  - Los PRs (Personal Records) se actualizan automáticamente tras completar un set en WorkoutsScreen.
  - Usa `StorageService.updatePersonalRecord(exerciseId, weight, reps, date)` para comparar y guardar nuevos récords de peso o volumen.
  - Solo muestra alerta de PR si el nuevo valor supera el anterior (no en cada set).
  - Estructura de PR:
    ```js
    {
      [exerciseId]: {
        maxWeight: { weight, reps, date },
        maxVolume: { volume, date }
      }
    }
    ```
  - Ver lógica en `src/services/storage.js` y uso en `WorkoutsScreen.js`.

  ## Manejo de Plantillas
  - Las plantillas de entrenamiento se almacenan y gestionan vía `StorageService` (`@workout_templates`).
  - Import/export:
    - Exporta usando Share API (`Share.share`) o Clipboard (`Clipboard.setStringAsync`).
    - Importa pegando JSON en el modal de TemplatesScreen; valida estructura antes de guardar.
    - Deduplicación por `id` al importar (no sobrescribe existentes).
  - Estructura mínima:
    ```js
    {
      id: '...',
      name: '...',
      description: '...',
      exercises: [{ exerciseId, sets, reps }]
    }
    ```
  - Ver detalles en `src/screens/TemplatesScreen.js` y `src/services/storage.js`.

  ## Integración de Componentes
  - Todos los componentes nuevos deben ser theme-aware usando `useTheme()` y el patrón `createStyles(theme)`.
  - Ejemplo de integración:
    ```js
    import { useTheme } from '../context/ThemeContext';
    const { theme } = useTheme();
    const styles = createStyles(theme);
    ```
  - Componentes clave:
    - `RestTimer`: Modal de cuenta regresiva, notifica al usuario tras completar sets.
    - `PlateCalculator`: Calculadora de discos, retorna peso seleccionado al padre vía callback.
    - `ExerciseVideoModal`: Reproduce videos de YouTube, requiere `videoUrl` directo.
  - Todos los componentes están en `src/components/` y deben seguir el patrón de modales controlados por estado local.
  - **Alternativas de ejercicio**:
    ```js
    // Sugerir alternativas en WorkoutsScreen.js
    const suggestAlternative = (exerciseId) => {
      const exercise = exercises.find(e => e.id === exerciseId);
      if (exercise?.alternatives?.length) {
        const altNames = exercise.alternatives
          .map(altId => exercises.find(e => e.id === altId)?.name)
          .filter(Boolean).join('\n');
        Alert.alert('Exercise Alternatives', `Alternative exercises for ${exercise.name}:\n\n${altNames}`);
      }
    };
    ```
  - **Creación de entrada de progreso**:
    ```js
    const progressEntry = generateProgressEntry(workout, exercise.exerciseId);
    await StorageService.saveProgressEntry(progressEntry);
    ```

  ## Errores y Edge Cases
  - No crear referencias de ejercicios inexistentes en `alternatives`.
  - No duplicar plantillas por inicialización múltiple (`@templates_initialized`).
  - No eliminar datos de progreso al borrar workouts (histórico intencional).
  - URLs de video: solo enlaces directos de YouTube (no embeds).
  - PRs: Solo mostrar alerta si el nuevo peso supera el récord anterior.

  ## Archivos Clave
  - Navegación: `src/navigation/AppNavigator.js`
  - Almacenamiento: `src/services/storage.js`
  - Temas: `src/context/ThemeContext.js`
  - Ejercicios: `src/data/exercises.js`
  - Helpers: `src/utils/helpers.js`
  - Pantallas: `src/screens/`
  - Componentes: `src/components/`

  ---
  ¿Falta algún flujo, convención o edge case importante? Indícalo para mejorar la guía.
1. Complete store listing content
