# Integración automática de google-services.json (Android)

Para builds locales y EAS Build, el archivo `google-services.json` debe estar en `config/` o en la raíz del proyecto. Antes de cada build de Android, el script `scripts/copy-google-services.sh` lo copiará automáticamente a `android/app/`.

### Uso local

1. Coloca tu `google-services.json` en `config/` o en la raíz del proyecto.
2. Ejecuta:
	 ```bash
	 npm run prebuild:android && npm run android
	 ```

### Uso con EAS Build

En `eas.json`, puedes usar el hook `prebuild` para ejecutar el script automáticamente:

```json
{
	"build": {
		"production": {
			"android": {
				"prebuildCommand": "bash ./scripts/copy-google-services.sh"
			}
		}
	}
}
```

También puedes subir el archivo como secret en EAS y descargarlo en un step previo si no quieres almacenarlo en el repo.
# Splits Fitness & Nutrition

🏋️ A comprehensive React Native fitness and nutrition tracking application built with Expo. Track your workouts, nutrition, and progress with complete privacy - all data is stored locally on your device.

## Features

### 🏋️ Workout Tracking
- Create and track custom workouts
- Log exercises with sets, reps, and weight
- **Rest timer between sets** with customizable durations (60s, 90s, 120s, 180s)
- **Push notifications** when rest period is complete
- **Exercise replacement suggestions** - view alternative exercises for any movement
- Track workout history
- Calculate total volume and track progressive overload

### 🍎 Nutrition Tracking
- **Meal logging system** - log multiple meals per day
- **Macro calculations** - track protein, carbs, fats, and calories
- Daily nutrition summary with visual progress bars
- Date navigation to view historical nutrition data
- Food database with detailed nutritional information

### 📊 Progress Tracking
- **Progress charts** showing strength gains over time
- Track max weight and total volume for each exercise
- Visual line charts with historical data
- View percentage improvements
- Exercise-specific progress tracking

### 📝 Workout Templates
- **Custom workout program creator** - build and save workout templates
- Pre-configured templates (Push Day, Pull Day, Leg Day)
- **Import/Export functionality** - share templates via JSON
- Use templates to quickly start workouts
- Organize exercises by muscle groups

### 🔒 Privacy by Design
- 100% local storage using AsyncStorage
- Zero data collection
- No internet connection required
- Complete control over your data

## Installation

```bash
# Clone the repository
git clone https://github.com/josegilleite-cyber/Splits-Fitness-Nutrition.git
cd Splits-Fitness-Nutrition

# Install dependencies
npm install

# Start the Expo development server
npm start
```

## Running the App

```bash
# Start on iOS
npm run ios

# Start on Android
npm run android

# Start on Web
npm run web
```

## Tech Stack

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tooling
- **React Navigation** - Navigation between screens
- **AsyncStorage** - Local data persistence
- **Expo Notifications** - Rest timer notifications
- **React Native Chart Kit** - Progress visualization
- **Expo Clipboard** - Template import/export

## Project Structure

```
src/
├── components/        # Reusable UI components (RestTimer)
├── data/             # Exercise database
├── navigation/       # Navigation configuration
├── screens/          # Main app screens
│   ├── WorkoutsScreen.js
│   ├── NutritionScreen.js
│   ├── ProgressScreen.js
│   └── TemplatesScreen.js
├── services/         # Storage and data services
├── types/            # TypeScript type definitions
└── utils/            # Helper functions and utilities
```

## Key Features Implementation

### Rest Timer with Notifications
The rest timer component provides:
- Customizable duration presets (60s, 90s, 120s, 180s)
- Visual countdown with progress bar
- Warning state when time is low (<10s)
- Background notifications when timer completes
- Play, pause, and reset controls

### Exercise Replacement Suggestions
Each exercise in the database includes:
- List of alternative exercises
- Similar muscle group targeting
- Equipment variations
- Quick access via swap icon in workout screen

### Workout Templates Import/Export
Templates can be:
- Exported as JSON (via share or clipboard)
- Imported from JSON data
- Shared with other users
- Backed up externally

### Macro Calculations
Nutrition tracking includes:
- Automatic calculation of daily totals
- Visual progress bars for each macro
- Percentage tracking against goals
- Per-meal and daily summaries

### Progress Charts
Charts display:
- Max weight progression over time
- Total volume progression
- Last 10 workout entries
- Overall statistics with percentage changes

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
