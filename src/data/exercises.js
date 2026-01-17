export const exercises = [
  {
    id: 'bench-press',
    name: 'Bench Press',
    category: 'Strength',
    muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
    equipment: 'Barbell',
    description: 'Classic compound chest exercise',
    alternatives: ['dumbbell-bench-press', 'push-ups', 'incline-bench-press']
  },
  {
    id: 'squat',
    name: 'Barbell Squat',
    category: 'Strength',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    equipment: 'Barbell',
    description: 'Compound lower body exercise',
    alternatives: ['front-squat', 'goblet-squat', 'leg-press']
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    category: 'Strength',
    muscleGroups: ['Back', 'Hamstrings', 'Glutes'],
    equipment: 'Barbell',
    description: 'Full body compound movement',
    alternatives: ['romanian-deadlift', 'trap-bar-deadlift', 'rack-pulls']
  },
  {
    id: 'overhead-press',
    name: 'Overhead Press',
    category: 'Strength',
    muscleGroups: ['Shoulders', 'Triceps'],
    equipment: 'Barbell',
    description: 'Vertical pressing movement',
    alternatives: ['dumbbell-shoulder-press', 'arnold-press', 'push-press']
  },
  {
    id: 'pull-ups',
    name: 'Pull-ups',
    category: 'Strength',
    muscleGroups: ['Back', 'Biceps'],
    equipment: 'Pull-up Bar',
    description: 'Vertical pulling exercise',
    alternatives: ['lat-pulldown', 'chin-ups', 'assisted-pull-ups']
  },
  {
    id: 'dumbbell-bench-press',
    name: 'Dumbbell Bench Press',
    category: 'Strength',
    muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
    equipment: 'Dumbbells',
    description: 'Dumbbell variation of bench press',
    alternatives: ['bench-press', 'incline-dumbbell-press', 'floor-press']
  },
  {
    id: 'barbell-row',
    name: 'Barbell Row',
    category: 'Strength',
    muscleGroups: ['Back', 'Biceps'],
    equipment: 'Barbell',
    description: 'Horizontal pulling movement',
    alternatives: ['dumbbell-row', 'cable-row', 'pendlay-row']
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    category: 'Strength',
    muscleGroups: ['Quadriceps', 'Glutes'],
    equipment: 'Machine',
    description: 'Machine-based leg exercise',
    alternatives: ['squat', 'hack-squat', 'front-squat']
  },
  {
    id: 'incline-bench-press',
    name: 'Incline Bench Press',
    category: 'Strength',
    muscleGroups: ['Upper Chest', 'Shoulders', 'Triceps'],
    equipment: 'Barbell',
    description: 'Upper chest focused pressing',
    alternatives: ['bench-press', 'incline-dumbbell-press', 'low-incline-press']
  },
  {
    id: 'lateral-raises',
    name: 'Lateral Raises',
    category: 'Isolation',
    muscleGroups: ['Shoulders'],
    equipment: 'Dumbbells',
    description: 'Shoulder isolation exercise',
    alternatives: ['cable-lateral-raises', 'machine-lateral-raises', 'upright-row']
  },
  {
    id: 'bicep-curls',
    name: 'Bicep Curls',
    category: 'Isolation',
    muscleGroups: ['Biceps'],
    equipment: 'Dumbbells',
    description: 'Bicep isolation movement',
    alternatives: ['barbell-curls', 'hammer-curls', 'cable-curls']
  },
  {
    id: 'tricep-pushdown',
    name: 'Tricep Pushdown',
    category: 'Isolation',
    muscleGroups: ['Triceps'],
    equipment: 'Cable',
    description: 'Tricep isolation exercise',
    alternatives: ['overhead-tricep-extension', 'close-grip-bench', 'dips']
  },
  {
    id: 'leg-curl',
    name: 'Leg Curl',
    category: 'Isolation',
    muscleGroups: ['Hamstrings'],
    equipment: 'Machine',
    description: 'Hamstring isolation movement',
    alternatives: ['romanian-deadlift', 'nordic-curls', 'glute-ham-raise']
  },
  {
    id: 'leg-extension',
    name: 'Leg Extension',
    category: 'Isolation',
    muscleGroups: ['Quadriceps'],
    equipment: 'Machine',
    description: 'Quadriceps isolation exercise',
    alternatives: ['squat', 'bulgarian-split-squat', 'lunge']
  },
  {
    id: 'calf-raises',
    name: 'Calf Raises',
    category: 'Isolation',
    muscleGroups: ['Calves'],
    equipment: 'Machine',
    description: 'Calf isolation movement',
    alternatives: ['seated-calf-raises', 'standing-calf-raises', 'donkey-calf-raises']
  }
];
