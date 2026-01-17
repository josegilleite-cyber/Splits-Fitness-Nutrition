import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StorageService } from '../services/storage';
import { generateId, formatDate } from '../utils/helpers';

export default function NutritionScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [nutritionData, setNutritionData] = useState(null);
  const [showMealModal, setShowMealModal] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [currentMeal, setCurrentMeal] = useState(null);
  const [mealName, setMealName] = useState('');
  const [foodForm, setFoodForm] = useState({
    name: '',
    serving: '',
    servingUnit: 'g',
    calories: '',
    protein: '',
    carbs: '',
    fats: ''
  });

  useEffect(() => {
    loadNutritionData();
  }, [selectedDate]);

  const loadNutritionData = async () => {
    const data = await StorageService.getNutritionData(selectedDate);
    setNutritionData(data);
  };

  const startNewMeal = () => {
    setMealName('');
    setShowMealModal(true);
  };

  const createMeal = () => {
    if (!mealName.trim()) {
      Alert.alert('Error', 'Please enter a meal name');
      return;
    }

    const newMeal = {
      id: generateId(),
      name: mealName,
      date: selectedDate,
      time: new Date().toISOString(),
      foods: []
    };

    setCurrentMeal(newMeal);
    setShowMealModal(false);
    setShowFoodModal(true);
  };

  const addFoodToMeal = async () => {
    if (!foodForm.name.trim() || !foodForm.calories) {
      Alert.alert('Error', 'Please enter at least food name and calories');
      return;
    }

    const food = {
      id: generateId(),
      name: foodForm.name,
      serving: parseFloat(foodForm.serving) || 1,
      servingUnit: foodForm.servingUnit,
      calories: parseFloat(foodForm.calories) || 0,
      protein: parseFloat(foodForm.protein) || 0,
      carbs: parseFloat(foodForm.carbs) || 0,
      fats: parseFloat(foodForm.fats) || 0
    };

    const updatedMeal = {
      ...currentMeal,
      foods: [...currentMeal.foods, food]
    };

    setCurrentMeal(updatedMeal);
    
    // Reset form
    setFoodForm({
      name: '',
      serving: '',
      servingUnit: 'g',
      calories: '',
      protein: '',
      carbs: '',
      fats: ''
    });
  };

  const saveMeal = async () => {
    if (currentMeal.foods.length === 0) {
      Alert.alert('Error', 'Add at least one food item to save the meal');
      return;
    }

    await StorageService.saveMeal(currentMeal, selectedDate);
    setCurrentMeal(null);
    setShowFoodModal(false);
    loadNutritionData();
    Alert.alert('Success', 'Meal saved successfully!');
  };

  const deleteMeal = async (mealId) => {
    Alert.alert(
      'Delete Meal',
      'Are you sure you want to delete this meal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedData = { ...nutritionData };
            updatedData.meals = updatedData.meals.filter(m => m.id !== mealId);
            updatedData.totals = StorageService.calculateDayTotals(updatedData.meals);
            await StorageService.saveNutritionData(updatedData);
            loadNutritionData();
          }
        }
      ]
    );
  };

  const MacroCard = ({ label, value, total, color }) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
      <View style={styles.macroCard}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={[styles.macroValue, { color }]}>{Math.round(value)}g</Text>
        <View style={styles.macroBar}>
          <View style={[styles.macroBarFill, { width: `${Math.min(percentage, 100)}%`, backgroundColor: color }]} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateSelector}>
        <TouchableOpacity onPress={() => {
          const date = new Date(selectedDate);
          date.setDate(date.getDate() - 1);
          setSelectedDate(date.toISOString().split('T')[0]);
        }}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        <TouchableOpacity onPress={() => {
          const date = new Date(selectedDate);
          date.setDate(date.getDate() + 1);
          setSelectedDate(date.toISOString().split('T')[0]);
        }}>
          <Ionicons name="chevron-forward" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Daily Summary</Text>
          <View style={styles.caloriesContainer}>
            <Text style={styles.caloriesValue}>{Math.round(nutritionData?.totals?.calories || 0)}</Text>
            <Text style={styles.caloriesLabel}>Calories</Text>
          </View>
          
          <View style={styles.macrosContainer}>
            <MacroCard 
              label="Protein" 
              value={nutritionData?.totals?.protein || 0}
              total={200}
              color="#E91E63"
            />
            <MacroCard 
              label="Carbs" 
              value={nutritionData?.totals?.carbs || 0}
              total={300}
              color="#2196F3"
            />
            <MacroCard 
              label="Fats" 
              value={nutritionData?.totals?.fats || 0}
              total={70}
              color="#FF9800"
            />
          </View>
        </View>

        <View style={styles.mealsSection}>
          <Text style={styles.sectionTitle}>Meals</Text>
          {nutritionData?.meals?.map((meal) => (
            <View key={meal.id} style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <View>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <Text style={styles.mealTime}>{new Date(meal.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
                <TouchableOpacity onPress={() => deleteMeal(meal.id)}>
                  <Ionicons name="trash-outline" size={24} color="#f44336" />
                </TouchableOpacity>
              </View>
              
              {meal.foods.map((food) => (
                <View key={food.id} style={styles.foodItem}>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.foodDetails}>
                    {food.serving} {food.servingUnit} • {Math.round(food.calories)} cal
                  </Text>
                  <Text style={styles.foodMacros}>
                    P: {Math.round(food.protein)}g • C: {Math.round(food.carbs)}g • F: {Math.round(food.fats)}g
                  </Text>
                </View>
              ))}
              
              <View style={styles.mealTotals}>
                <Text style={styles.mealTotalsText}>
                  Total: {Math.round(meal.foods.reduce((sum, f) => sum + f.calories, 0))} cal
                </Text>
              </View>
            </View>
          ))}

          {(!nutritionData?.meals || nutritionData.meals.length === 0) && (
            <View style={styles.emptyContainer}>
              <Ionicons name="restaurant-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No meals logged</Text>
              <Text style={styles.emptySubtext}>Start tracking your nutrition!</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={startNewMeal}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      <Modal visible={showMealModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Meal</Text>
            <TextInput
              style={styles.input}
              placeholder="Meal Name (e.g., Breakfast)"
              value={mealName}
              onChangeText={setMealName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowMealModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={createMeal}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showFoodModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Food to {currentMeal?.name}</Text>
            <TouchableOpacity onPress={() => {
              setShowFoodModal(false);
              setCurrentMeal(null);
            }}>
              <Ionicons name="close" size={32} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.foodForm}>
            <TextInput
              style={styles.input}
              placeholder="Food Name"
              value={foodForm.name}
              onChangeText={(text) => setFoodForm({ ...foodForm, name: text })}
            />
            
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.inputHalf]}
                placeholder="Serving"
                keyboardType="numeric"
                value={foodForm.serving}
                onChangeText={(text) => setFoodForm({ ...foodForm, serving: text })}
              />
              <TextInput
                style={[styles.input, styles.inputHalf]}
                placeholder="Unit (g, oz, cup)"
                value={foodForm.servingUnit}
                onChangeText={(text) => setFoodForm({ ...foodForm, servingUnit: text })}
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Calories"
              keyboardType="numeric"
              value={foodForm.calories}
              onChangeText={(text) => setFoodForm({ ...foodForm, calories: text })}
            />

            <Text style={styles.formLabel}>Macros (optional)</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Protein (g)"
              keyboardType="numeric"
              value={foodForm.protein}
              onChangeText={(text) => setFoodForm({ ...foodForm, protein: text })}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Carbs (g)"
              keyboardType="numeric"
              value={foodForm.carbs}
              onChangeText={(text) => setFoodForm({ ...foodForm, carbs: text })}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Fats (g)"
              keyboardType="numeric"
              value={foodForm.fats}
              onChangeText={(text) => setFoodForm({ ...foodForm, fats: text })}
            />

            <TouchableOpacity style={styles.addFoodButton} onPress={addFoodToMeal}>
              <Text style={styles.addFoodButtonText}>+ Add Another Food</Text>
            </TouchableOpacity>

            {currentMeal?.foods && currentMeal.foods.length > 0 && (
              <View style={styles.addedFoods}>
                <Text style={styles.addedFoodsTitle}>Added Foods ({currentMeal.foods.length})</Text>
                {currentMeal.foods.map((food) => (
                  <View key={food.id} style={styles.addedFoodItem}>
                    <Text style={styles.addedFoodName}>{food.name}</Text>
                    <Text style={styles.addedFoodCalories}>{Math.round(food.calories)} cal</Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={saveMeal}
            >
              <Text style={styles.saveButtonText}>Save Meal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  dateSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  caloriesContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  caloriesValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  caloriesLabel: {
    fontSize: 16,
    color: '#666',
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  macroCard: {
    flex: 1,
  },
  macroLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  macroBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  macroBarFill: {
    height: '100%',
  },
  mealsSection: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  mealCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mealTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  foodItem: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
    marginBottom: 8,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  foodDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  foodMacros: {
    fontSize: 12,
    color: '#999',
  },
  mealTotals: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
    marginTop: 4,
  },
  mealTotalsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#999',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    width: '80%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  inputHalf: {
    flex: 1,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#4CAF50',
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonTextPrimary: {
    color: '#fff',
  },
  foodForm: {
    flex: 1,
    padding: 16,
  },
  addFoodButton: {
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 4,
    marginTop: 8,
  },
  addFoodButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addedFoods: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  addedFoodsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  addedFoodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  addedFoodName: {
    fontSize: 14,
  },
  addedFoodCalories: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  saveButton: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
