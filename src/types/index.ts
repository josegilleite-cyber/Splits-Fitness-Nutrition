export interface Exercise {
  id: string;
  name: string;
  category: string;
  muscleGroups: string[];
  equipment: string;
  description: string;
  alternatives?: string[]; // IDs of alternative exercises
}

export interface WorkoutSet {
  id: string;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  sets: WorkoutSet[];
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  date: string;
  exercises: WorkoutExercise[];
  duration?: number;
  completed: boolean;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  exercises: {
    exerciseId: string;
    sets: number;
    reps: number;
  }[];
}

export interface Meal {
  id: string;
  name: string;
  date: string;
  time: string;
  foods: FoodItem[];
}

export interface FoodItem {
  id: string;
  name: string;
  serving: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface DailyNutrition {
  date: string;
  meals: Meal[];
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

export interface ProgressEntry {
  date: string;
  exerciseId: string;
  maxWeight: number;
  totalVolume: number;
}
