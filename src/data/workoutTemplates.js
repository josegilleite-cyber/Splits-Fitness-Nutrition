export const workoutTemplates = [
  // BEGINNER PROGRAMS
  {
    id: 'beginner-full-body-a',
    name: 'Beginner Full Body A',
    description: 'Perfect for beginners - 3x per week full body routine',
    difficulty: 'Beginner',
    duration: '45-60 min',
    frequency: '3x per week',
    isPremium: false,
    exercises: [
      { exerciseId: 'squat', sets: 3, reps: 10 },
      { exerciseId: 'bench-press', sets: 3, reps: 10 },
      { exerciseId: 'barbell-row', sets: 3, reps: 10 },
      { exerciseId: 'overhead-press', sets: 3, reps: 8 },
      { exerciseId: 'planks', sets: 3, reps: 30 }
    ]
  },
  {
    id: 'beginner-full-body-b',
    name: 'Beginner Full Body B',
    description: 'Alternate with Full Body A',
    difficulty: 'Beginner',
    duration: '45-60 min',
    frequency: '3x per week',
    isPremium: false,
    exercises: [
      { exerciseId: 'deadlift', sets: 3, reps: 8 },
      { exerciseId: 'incline-bench-press', sets: 3, reps: 10 },
      { exerciseId: 'lat-pulldown', sets: 3, reps: 12 },
      { exerciseId: 'lateral-raises', sets: 3, reps: 12 },
      { exerciseId: 'bicep-curls', sets: 2, reps: 12 },
      { exerciseId: 'tricep-pushdown', sets: 2, reps: 12 }
    ]
  },

  // PUSH PULL LEGS (PPL)
  {
    id: 'ppl-push',
    name: 'Push Day (PPL)',
    description: 'Chest, shoulders, and triceps - Part of PPL split',
    difficulty: 'Intermediate',
    duration: '60-75 min',
    frequency: '2x per week',
    isPremium: false,
    exercises: [
      { exerciseId: 'bench-press', sets: 4, reps: 8 },
      { exerciseId: 'overhead-press', sets: 3, reps: 10 },
      { exerciseId: 'incline-bench-press', sets: 3, reps: 10 },
      { exerciseId: 'dumbbell-bench-press', sets: 3, reps: 12 },
      { exerciseId: 'lateral-raises', sets: 4, reps: 15 },
      { exerciseId: 'tricep-pushdown', sets: 3, reps: 12 },
      { exerciseId: 'dips', sets: 3, reps: 10 }
    ]
  },
  {
    id: 'ppl-pull',
    name: 'Pull Day (PPL)',
    description: 'Back and biceps - Part of PPL split',
    difficulty: 'Intermediate',
    duration: '60-75 min',
    frequency: '2x per week',
    isPremium: false,
    exercises: [
      { exerciseId: 'deadlift', sets: 4, reps: 6 },
      { exerciseId: 'pull-ups', sets: 4, reps: 8 },
      { exerciseId: 'barbell-row', sets: 4, reps: 8 },
      { exerciseId: 'lat-pulldown', sets: 3, reps: 12 },
      { exerciseId: 'seated-cable-row', sets: 3, reps: 12 },
      { exerciseId: 'face-pulls', sets: 4, reps: 15 },
      { exerciseId: 'bicep-curls', sets: 3, reps: 12 },
      { exerciseId: 'hammer-curls', sets: 3, reps: 12 }
    ]
  },
  {
    id: 'ppl-legs',
    name: 'Leg Day (PPL)',
    description: 'Complete lower body - Part of PPL split',
    difficulty: 'Intermediate',
    duration: '60-75 min',
    frequency: '2x per week',
    isPremium: false,
    exercises: [
      { exerciseId: 'squat', sets: 4, reps: 8 },
      { exerciseId: 'romanian-deadlift', sets: 3, reps: 10 },
      { exerciseId: 'leg-press', sets: 3, reps: 12 },
      { exerciseId: 'leg-curl', sets: 3, reps: 12 },
      { exerciseId: 'leg-extension', sets: 3, reps: 12 },
      { exerciseId: 'bulgarian-split-squat', sets: 3, reps: 10 },
      { exerciseId: 'calf-raises', sets: 4, reps: 15 }
    ]
  },

  // UPPER LOWER SPLIT
  {
    id: 'upper-power',
    name: 'Upper Body Power',
    description: 'Heavy compound upper body movements',
    difficulty: 'Intermediate',
    duration: '60-75 min',
    frequency: '2x per week',
    isPremium: true,
    exercises: [
      { exerciseId: 'bench-press', sets: 5, reps: 5 },
      { exerciseId: 'barbell-row', sets: 5, reps: 5 },
      { exerciseId: 'overhead-press', sets: 4, reps: 6 },
      { exerciseId: 'pull-ups', sets: 4, reps: 8 },
      { exerciseId: 'dips', sets: 3, reps: 8 }
    ]
  },
  {
    id: 'lower-power',
    name: 'Lower Body Power',
    description: 'Heavy compound leg movements',
    difficulty: 'Intermediate',
    duration: '60-75 min',
    frequency: '2x per week',
    isPremium: true,
    exercises: [
      { exerciseId: 'squat', sets: 5, reps: 5 },
      { exerciseId: 'deadlift', sets: 4, reps: 5 },
      { exerciseId: 'leg-press', sets: 4, reps: 8 },
      { exerciseId: 'leg-curl', sets: 3, reps: 10 },
      { exerciseId: 'calf-raises', sets: 4, reps: 12 }
    ]
  },
  {
    id: 'upper-hypertrophy',
    name: 'Upper Body Hypertrophy',
    description: 'High volume upper body for muscle growth',
    difficulty: 'Intermediate',
    duration: '75-90 min',
    frequency: '2x per week',
    isPremium: true,
    exercises: [
      { exerciseId: 'incline-bench-press', sets: 4, reps: 10 },
      { exerciseId: 'dumbbell-bench-press', sets: 4, reps: 12 },
      { exerciseId: 'cable-flyes', sets: 3, reps: 15 },
      { exerciseId: 'lat-pulldown', sets: 4, reps: 12 },
      { exerciseId: 'seated-cable-row', sets: 4, reps: 12 },
      { exerciseId: 'lateral-raises', sets: 4, reps: 15 },
      { exerciseId: 'rear-delt-flyes', sets: 3, reps: 15 },
      { exerciseId: 'bicep-curls', sets: 3, reps: 12 },
      { exerciseId: 'skull-crushers', sets: 3, reps: 12 }
    ]
  },
  {
    id: 'lower-hypertrophy',
    name: 'Lower Body Hypertrophy',
    description: 'High volume legs for maximum growth',
    difficulty: 'Intermediate',
    duration: '75-90 min',
    frequency: '2x per week',
    isPremium: true,
    exercises: [
      { exerciseId: 'squat', sets: 4, reps: 10 },
      { exerciseId: 'romanian-deadlift', sets: 4, reps: 10 },
      { exerciseId: 'leg-press', sets: 4, reps: 15 },
      { exerciseId: 'bulgarian-split-squat', sets: 3, reps: 12 },
      { exerciseId: 'leg-curl', sets: 4, reps: 12 },
      { exerciseId: 'leg-extension', sets: 4, reps: 15 },
      { exerciseId: 'calf-raises', sets: 5, reps: 20 }
    ]
  },

  // BRO SPLIT
  {
    id: 'chest-day',
    name: 'Chest Day',
    description: 'Complete chest workout for mass and definition',
    difficulty: 'Intermediate',
    duration: '60-75 min',
    frequency: '1x per week',
    isPremium: true,
    exercises: [
      { exerciseId: 'bench-press', sets: 4, reps: 8 },
      { exerciseId: 'incline-bench-press', sets: 4, reps: 10 },
      { exerciseId: 'dumbbell-bench-press', sets: 3, reps: 12 },
      { exerciseId: 'cable-flyes', sets: 3, reps: 15 },
      { exerciseId: 'dips', sets: 3, reps: 12 },
      { exerciseId: 'push-ups', sets: 3, reps: 20 }
    ]
  },
  {
    id: 'back-day',
    name: 'Back Day',
    description: 'Complete back workout for width and thickness',
    difficulty: 'Intermediate',
    duration: '60-75 min',
    frequency: '1x per week',
    isPremium: true,
    exercises: [
      { exerciseId: 'deadlift', sets: 4, reps: 6 },
      { exerciseId: 'pull-ups', sets: 4, reps: 10 },
      { exerciseId: 'barbell-row', sets: 4, reps: 8 },
      { exerciseId: 'lat-pulldown', sets: 3, reps: 12 },
      { exerciseId: 'seated-cable-row', sets: 3, reps: 12 },
      { exerciseId: 'face-pulls', sets: 4, reps: 15 }
    ]
  },
  {
    id: 'shoulder-day',
    name: 'Shoulder Day',
    description: 'Complete shoulder workout for 3D delts',
    difficulty: 'Intermediate',
    duration: '60 min',
    frequency: '1x per week',
    isPremium: true,
    exercises: [
      { exerciseId: 'overhead-press', sets: 4, reps: 8 },
      { exerciseId: 'lateral-raises', sets: 4, reps: 15 },
      { exerciseId: 'rear-delt-flyes', sets: 4, reps: 15 },
      { exerciseId: 'face-pulls', sets: 4, reps: 15 },
      { exerciseId: 'push-ups', sets: 3, reps: 15 }
    ]
  },
  {
    id: 'arm-day',
    name: 'Arm Day',
    description: 'Biceps and triceps superset workout',
    difficulty: 'Intermediate',
    duration: '60 min',
    frequency: '1x per week',
    isPremium: true,
    exercises: [
      { exerciseId: 'bicep-curls', sets: 4, reps: 10 },
      { exerciseId: 'skull-crushers', sets: 4, reps: 10 },
      { exerciseId: 'hammer-curls', sets: 4, reps: 12 },
      { exerciseId: 'tricep-pushdown', sets: 4, reps: 12 },
      { exerciseId: 'dips', sets: 3, reps: 12 }
    ]
  },

  // SPECIALIZED PROGRAMS
  {
    id: 'strength-5x5',
    name: 'Strength 5x5 Program',
    description: 'Classic 5x5 for maximum strength gains',
    difficulty: 'Advanced',
    duration: '60 min',
    frequency: '3x per week',
    isPremium: true,
    exercises: [
      { exerciseId: 'squat', sets: 5, reps: 5 },
      { exerciseId: 'bench-press', sets: 5, reps: 5 },
      { exerciseId: 'barbell-row', sets: 5, reps: 5 },
      { exerciseId: 'overhead-press', sets: 3, reps: 5 },
      { exerciseId: 'deadlift', sets: 1, reps: 5 }
    ]
  },
  {
    id: 'bodyweight-home',
    name: 'Home Bodyweight Workout',
    description: 'No equipment needed - train anywhere',
    difficulty: 'Beginner',
    duration: '30-45 min',
    frequency: '4x per week',
    isPremium: false,
    exercises: [
      { exerciseId: 'push-ups', sets: 4, reps: 15 },
      { exerciseId: 'pull-ups', sets: 3, reps: 10 },
      { exerciseId: 'dips', sets: 3, reps: 12 },
      { exerciseId: 'planks', sets: 3, reps: 60 },
      { exerciseId: 'russian-twists', sets: 3, reps: 20 }
    ]
  },
  {
    id: 'core-abs',
    name: 'Core & Abs Blast',
    description: 'Intense core workout for definition',
    difficulty: 'Intermediate',
    duration: '20-30 min',
    frequency: '3x per week',
    isPremium: true,
    exercises: [
      { exerciseId: 'planks', sets: 3, reps: 60 },
      { exerciseId: 'hanging-leg-raises', sets: 4, reps: 12 },
      { exerciseId: 'russian-twists', sets: 4, reps: 30 },
      { exerciseId: 'push-ups', sets: 3, reps: 15 }
    ]
  },

  // HYPERTROPHY PROGRAMS (PREMIUM)
  {
    id: 'hypertrophy-chest-back',
    name: '💎 Hypertrophy: Chest & Back',
    description: 'High volume chest and back hypertrophy - 8-12 rep range for maximum muscle growth',
    difficulty: 'Intermediate',
    duration: '75-90 min',
    frequency: '2x per week',
    isPremium: true,
    category: 'Hypertrophy',
    exercises: [
      { exerciseId: 'bench-press', sets: 4, reps: 10, restTime: 120 },
      { exerciseId: 'incline-dumbbell-press', sets: 4, reps: 12, restTime: 90 },
      { exerciseId: 'cable-flyes', sets: 3, reps: 15, restTime: 60 },
      { exerciseId: 'barbell-row', sets: 4, reps: 10, restTime: 120 },
      { exerciseId: 'lat-pulldown', sets: 4, reps: 12, restTime: 90 },
      { exerciseId: 'dumbbell-row', sets: 3, reps: 12, restTime: 90 },
      { exerciseId: 'face-pulls', sets: 3, reps: 15, restTime: 60 }
    ]
  },
  {
    id: 'hypertrophy-legs',
    name: '💎 Hypertrophy: Leg Builder',
    description: 'Complete leg hypertrophy - quad, hamstring, glute focus with high volume',
    difficulty: 'Advanced',
    duration: '90-100 min',
    frequency: '2x per week',
    isPremium: true,
    category: 'Hypertrophy',
    exercises: [
      { exerciseId: 'squat', sets: 4, reps: 10, restTime: 180 },
      { exerciseId: 'leg-press', sets: 4, reps: 12, restTime: 120 },
      { exerciseId: 'walking-lunges', sets: 3, reps: 12, restTime: 90 },
      { exerciseId: 'leg-extension', sets: 3, reps: 15, restTime: 60 },
      { exerciseId: 'romanian-deadlift', sets: 4, reps: 10, restTime: 120 },
      { exerciseId: 'leg-curl', sets: 4, reps: 12, restTime: 90 },
      { exerciseId: 'calf-raises', sets: 4, reps: 20, restTime: 60 }
    ]
  },
  {
    id: 'hypertrophy-arms',
    name: '💎 Hypertrophy: Arm Annihilator',
    description: 'Biceps and triceps hypertrophy - pump-focused with multiple angles',
    difficulty: 'Intermediate',
    duration: '60-75 min',
    frequency: '2x per week',
    isPremium: true,
    category: 'Hypertrophy',
    exercises: [
      { exerciseId: 'close-grip-bench', sets: 4, reps: 10, restTime: 120 },
      { exerciseId: 'tricep-dips', sets: 3, reps: 12, restTime: 90 },
      { exerciseId: 'overhead-extension', sets: 3, reps: 12, restTime: 90 },
      { exerciseId: 'tricep-pushdown', sets: 3, reps: 15, restTime: 60 },
      { exerciseId: 'barbell-curl', sets: 4, reps: 10, restTime: 90 },
      { exerciseId: 'hammer-curls', sets: 3, reps: 12, restTime: 90 },
      { exerciseId: 'preacher-curls', sets: 3, reps: 12, restTime: 90 },
      { exerciseId: 'cable-curls', sets: 2, reps: 15, restTime: 60 }
    ]
  },
  {
    id: 'hypertrophy-shoulders',
    name: '💎 Hypertrophy: Shoulder Sculpt',
    description: 'Complete shoulder development - anterior, medial, posterior delts',
    difficulty: 'Intermediate',
    duration: '60-75 min',
    frequency: '2x per week',
    isPremium: true,
    category: 'Hypertrophy',
    exercises: [
      { exerciseId: 'overhead-press', sets: 4, reps: 10, restTime: 120 },
      { exerciseId: 'dumbbell-press', sets: 4, reps: 12, restTime: 90 },
      { exerciseId: 'lateral-raises', sets: 4, reps: 15, restTime: 60 },
      { exerciseId: 'front-raises', sets: 3, reps: 12, restTime: 60 },
      { exerciseId: 'reverse-flyes', sets: 4, reps: 15, restTime: 60 },
      { exerciseId: 'face-pulls', sets: 3, reps: 15, restTime: 60 },
      { exerciseId: 'shrugs', sets: 3, reps: 15, restTime: 90 }
    ]
  },
  {
    id: 'hypertrophy-upper-body',
    name: '💎 Hypertrophy: Upper Body Mass',
    description: 'Complete upper body hypertrophy - chest, back, shoulders, arms',
    difficulty: 'Advanced',
    duration: '90-120 min',
    frequency: '2x per week',
    isPremium: true,
    category: 'Hypertrophy',
    exercises: [
      { exerciseId: 'bench-press', sets: 4, reps: 8, restTime: 180 },
      { exerciseId: 'barbell-row', sets: 4, reps: 8, restTime: 180 },
      { exerciseId: 'overhead-press', sets: 4, reps: 10, restTime: 120 },
      { exerciseId: 'lat-pulldown', sets: 3, reps: 12, restTime: 90 },
      { exerciseId: 'incline-dumbbell-press', sets: 3, reps: 12, restTime: 90 },
      { exerciseId: 'cable-row', sets: 3, reps: 12, restTime: 90 },
      { exerciseId: 'lateral-raises', sets: 3, reps: 15, restTime: 60 },
      { exerciseId: 'barbell-curl', sets: 3, reps: 12, restTime: 90 },
      { exerciseId: 'tricep-pushdown', sets: 3, reps: 12, restTime: 90 }
    ]
  },
  {
    id: 'hypertrophy-full-body',
    name: '💎 Hypertrophy: Full Body Blast',
    description: 'Full body hypertrophy - hit every muscle group in one session',
    difficulty: 'Intermediate',
    duration: '90-100 min',
    frequency: '3x per week',
    isPremium: true,
    category: 'Hypertrophy',
    exercises: [
      { exerciseId: 'squat', sets: 4, reps: 10, restTime: 180 },
      { exerciseId: 'bench-press', sets: 4, reps: 10, restTime: 120 },
      { exerciseId: 'deadlift', sets: 3, reps: 8, restTime: 180 },
      { exerciseId: 'overhead-press', sets: 3, reps: 10, restTime: 120 },
      { exerciseId: 'barbell-row', sets: 3, reps: 12, restTime: 90 },
      { exerciseId: 'leg-press', sets: 3, reps: 12, restTime: 120 },
      { exerciseId: 'lat-pulldown', sets: 3, reps: 12, restTime: 90 },
      { exerciseId: 'lateral-raises', sets: 3, reps: 15, restTime: 60 },
      { exerciseId: 'barbell-curl', sets: 2, reps: 12, restTime: 90 },
      { exerciseId: 'tricep-pushdown', sets: 2, reps: 12, restTime: 90 }
    ]
  }
];
