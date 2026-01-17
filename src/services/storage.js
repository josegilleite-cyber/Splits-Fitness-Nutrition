import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  WORKOUTS: '@workouts',
  TEMPLATES: '@workout_templates',
  NUTRITION: '@nutrition_data',
  PROGRESS: '@progress_data',
  SETTINGS: '@settings'
};

export const StorageService = {
  // Workouts
  async getWorkouts() {
    try {
      const data = await AsyncStorage.getItem(KEYS.WORKOUTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading workouts:', error);
      return [];
    }
  },

  async saveWorkout(workout) {
    try {
      const workouts = await this.getWorkouts();
      const existingIndex = workouts.findIndex(w => w.id === workout.id);
      
      if (existingIndex >= 0) {
        workouts[existingIndex] = workout;
      } else {
        workouts.push(workout);
      }
      
      await AsyncStorage.setItem(KEYS.WORKOUTS, JSON.stringify(workouts));
      return workout;
    } catch (error) {
      console.error('Error saving workout:', error);
      throw error;
    }
  },

  async deleteWorkout(workoutId) {
    try {
      const workouts = await this.getWorkouts();
      const filtered = workouts.filter(w => w.id !== workoutId);
      await AsyncStorage.setItem(KEYS.WORKOUTS, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw error;
    }
  },

  // Templates
  async getTemplates() {
    try {
      const data = await AsyncStorage.getItem(KEYS.TEMPLATES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading templates:', error);
      return [];
    }
  },

  async saveTemplate(template) {
    try {
      const templates = await this.getTemplates();
      const existingIndex = templates.findIndex(t => t.id === template.id);
      
      if (existingIndex >= 0) {
        templates[existingIndex] = template;
      } else {
        templates.push(template);
      }
      
      await AsyncStorage.setItem(KEYS.TEMPLATES, JSON.stringify(templates));
      return template;
    } catch (error) {
      console.error('Error saving template:', error);
      throw error;
    }
  },

  async deleteTemplate(templateId) {
    try {
      const templates = await this.getTemplates();
      const filtered = templates.filter(t => t.id !== templateId);
      await AsyncStorage.setItem(KEYS.TEMPLATES, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  },

  async importTemplates(templatesJson) {
    try {
      const newTemplates = JSON.parse(templatesJson);
      const existingTemplates = await this.getTemplates();
      const merged = [...existingTemplates, ...newTemplates];
      await AsyncStorage.setItem(KEYS.TEMPLATES, JSON.stringify(merged));
      return merged;
    } catch (error) {
      console.error('Error importing templates:', error);
      throw error;
    }
  },

  async exportTemplates() {
    try {
      const templates = await this.getTemplates();
      return JSON.stringify(templates, null, 2);
    } catch (error) {
      console.error('Error exporting templates:', error);
      throw error;
    }
  },

  // Nutrition
  async getNutritionData(date) {
    try {
      const data = await AsyncStorage.getItem(KEYS.NUTRITION);
      const allData = data ? JSON.parse(data) : {};
      return allData[date] || { date, meals: [], totals: { calories: 0, protein: 0, carbs: 0, fats: 0 } };
    } catch (error) {
      console.error('Error loading nutrition data:', error);
      return { date, meals: [], totals: { calories: 0, protein: 0, carbs: 0, fats: 0 } };
    }
  },

  async saveNutritionData(dateData) {
    try {
      const data = await AsyncStorage.getItem(KEYS.NUTRITION);
      const allData = data ? JSON.parse(data) : {};
      allData[dateData.date] = dateData;
      await AsyncStorage.setItem(KEYS.NUTRITION, JSON.stringify(allData));
    } catch (error) {
      console.error('Error saving nutrition data:', error);
      throw error;
    }
  },

  async saveMeal(meal, date) {
    try {
      const dayData = await this.getNutritionData(date);
      const existingIndex = dayData.meals.findIndex(m => m.id === meal.id);
      
      if (existingIndex >= 0) {
        dayData.meals[existingIndex] = meal;
      } else {
        dayData.meals.push(meal);
      }
      
      // Recalculate totals
      dayData.totals = this.calculateDayTotals(dayData.meals);
      
      await this.saveNutritionData(dayData);
      return dayData;
    } catch (error) {
      console.error('Error saving meal:', error);
      throw error;
    }
  },

  calculateDayTotals(meals) {
    return meals.reduce((totals, meal) => {
      meal.foods.forEach(food => {
        totals.calories += food.calories;
        totals.protein += food.protein;
        totals.carbs += food.carbs;
        totals.fats += food.fats;
      });
      return totals;
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
  },

  // Progress
  async getProgressData() {
    try {
      const data = await AsyncStorage.getItem(KEYS.PROGRESS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading progress data:', error);
      return [];
    }
  },

  async saveProgressEntry(entry) {
    try {
      const progress = await this.getProgressData();
      progress.push(entry);
      await AsyncStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress entry:', error);
      throw error;
    }
  },

  async getProgressForExercise(exerciseId) {
    try {
      const allProgress = await this.getProgressData();
      return allProgress.filter(p => p.exerciseId === exerciseId).sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      );
    } catch (error) {
      console.error('Error loading exercise progress:', error);
      return [];
    }
  }
};
