import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StorageService } from '../services/storage';
import { exercises } from '../data/exercises';
import { generateId, formatDate, generateProgressEntry } from '../utils/helpers';
import RestTimer from '../components/RestTimer';

export default function WorkoutsScreen() {
  const [workouts, setWorkouts] = useState([]);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [workoutName, setWorkoutName] = useState('');

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    const data = await StorageService.getWorkouts();
    setWorkouts(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  const startNewWorkout = () => {
    setWorkoutName('');
    setShowWorkoutModal(true);
  };

  const createWorkout = () => {
    if (!workoutName.trim()) {
      Alert.alert('Error', 'Please enter a workout name');
      return;
    }

    const newWorkout = {
      id: generateId(),
      name: workoutName,
      date: new Date().toISOString(),
      exercises: [],
      completed: false
    };

    setCurrentWorkout(newWorkout);
    setShowWorkoutModal(false);
    setShowExerciseSelector(true);
  };

  const addExerciseToWorkout = (exercise) => {
    const workoutExercise = {
      id: generateId(),
      exerciseId: exercise.id,
      sets: [
        { id: generateId(), reps: 10, weight: 0, completed: false },
        { id: generateId(), reps: 10, weight: 0, completed: false },
        { id: generateId(), reps: 10, weight: 0, completed: false }
      ],
      notes: ''
    };

    setCurrentWorkout({
      ...currentWorkout,
      exercises: [...currentWorkout.exercises, workoutExercise]
    });
    setShowExerciseSelector(false);
  };

  const updateSet = (exerciseIndex, setIndex, field, value) => {
    const updated = { ...currentWorkout };
    updated.exercises[exerciseIndex].sets[setIndex][field] = value;
    setCurrentWorkout(updated);
  };

  const toggleSetComplete = (exerciseIndex, setIndex) => {
    const updated = { ...currentWorkout };
    updated.exercises[exerciseIndex].sets[setIndex].completed = 
      !updated.exercises[exerciseIndex].sets[setIndex].completed;
    setCurrentWorkout(updated);
    
    // Show rest timer after completing a set
    if (updated.exercises[exerciseIndex].sets[setIndex].completed) {
      setShowRestTimer(true);
    }
  };

  const addSet = (exerciseIndex) => {
    const updated = { ...currentWorkout };
    const lastSet = updated.exercises[exerciseIndex].sets[updated.exercises[exerciseIndex].sets.length - 1];
    updated.exercises[exerciseIndex].sets.push({
      id: generateId(),
      reps: lastSet?.reps || 10,
      weight: lastSet?.weight || 0,
      completed: false
    });
    setCurrentWorkout(updated);
  };

  const removeExercise = (exerciseIndex) => {
    const updated = { ...currentWorkout };
    updated.exercises.splice(exerciseIndex, 1);
    setCurrentWorkout(updated);
  };

  const suggestAlternative = (exerciseId) => {
    const exercise = exercises.find(e => e.id === exerciseId);
    if (exercise && exercise.alternatives && exercise.alternatives.length > 0) {
      const alternatives = exercise.alternatives
        .map(altId => exercises.find(e => e.id === altId))
        .filter(e => e);
      
      const altNames = alternatives.map(e => e.name).join('\n');
      Alert.alert(
        'Exercise Alternatives',
        `Alternative exercises for ${exercise.name}:\n\n${altNames}`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert('No Alternatives', 'No alternative exercises found for this exercise.');
    }
  };

  const saveWorkout = async () => {
    if (currentWorkout.exercises.length === 0) {
      Alert.alert('Error', 'Add at least one exercise to save the workout');
      return;
    }

    const completed = { ...currentWorkout, completed: true };
    await StorageService.saveWorkout(completed);
    
    // Save progress data for each exercise
    for (const exercise of completed.exercises) {
      const progressEntry = generateProgressEntry(completed, exercise.exerciseId);
      if (progressEntry) {
        await StorageService.saveProgressEntry(progressEntry);
      }
    }

    setCurrentWorkout(null);
    loadWorkouts();
    Alert.alert('Success', 'Workout saved successfully!');
  };

  const deleteWorkout = async (workoutId) => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await StorageService.deleteWorkout(workoutId);
            loadWorkouts();
          }
        }
      ]
    );
  };

  const getExerciseName = (exerciseId) => {
    const exercise = exercises.find(e => e.id === exerciseId);
    return exercise ? exercise.name : 'Unknown Exercise';
  };

  if (currentWorkout) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.workoutTitle}>{currentWorkout.name}</Text>
          <TouchableOpacity onPress={() => setShowExerciseSelector(true)} style={styles.addButton}>
            <Ionicons name="add-circle" size={32} color="#2196F3" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.exerciseList}>
          {currentWorkout.exercises.map((exercise, exerciseIndex) => (
            <View key={exercise.id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.exerciseName}>{getExerciseName(exercise.exerciseId)}</Text>
                <View style={styles.exerciseActions}>
                  <TouchableOpacity onPress={() => suggestAlternative(exercise.exerciseId)}>
                    <Ionicons name="swap-horizontal" size={24} color="#2196F3" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeExercise(exerciseIndex)}>
                    <Ionicons name="trash" size={24} color="#f44336" />
                  </TouchableOpacity>
                </View>
              </View>

              {exercise.sets.map((set, setIndex) => (
                <View key={set.id} style={styles.setRow}>
                  <Text style={styles.setNumber}>Set {setIndex + 1}</Text>
                  <TextInput
                    style={styles.setInput}
                    placeholder="Reps"
                    keyboardType="numeric"
                    value={set.reps.toString()}
                    onChangeText={(text) => updateSet(exerciseIndex, setIndex, 'reps', parseInt(text) || 0)}
                  />
                  <TextInput
                    style={styles.setInput}
                    placeholder="Weight"
                    keyboardType="numeric"
                    value={set.weight.toString()}
                    onChangeText={(text) => updateSet(exerciseIndex, setIndex, 'weight', parseFloat(text) || 0)}
                  />
                  <TouchableOpacity onPress={() => toggleSetComplete(exerciseIndex, setIndex)}>
                    <Ionicons
                      name={set.completed ? "checkmark-circle" : "checkmark-circle-outline"}
                      size={32}
                      color={set.completed ? "#4CAF50" : "#999"}
                    />
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity onPress={() => addSet(exerciseIndex)} style={styles.addSetButton}>
                <Text style={styles.addSetText}>+ Add Set</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => setCurrentWorkout(null)} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={saveWorkout} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Complete Workout</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={showExerciseSelector} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Exercise</Text>
              <TouchableOpacity onPress={() => setShowExerciseSelector(false)}>
                <Ionicons name="close" size={32} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={exercises}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.exerciseOption}
                  onPress={() => addExerciseToWorkout(item)}
                >
                  <Text style={styles.exerciseOptionName}>{item.name}</Text>
                  <Text style={styles.exerciseOptionDetails}>
                    {item.muscleGroups.join(', ')} • {item.equipment}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>

        <RestTimer visible={showRestTimer} onClose={() => setShowRestTimer(false)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.workoutCard}>
            <View style={styles.workoutCardHeader}>
              <View>
                <Text style={styles.workoutCardTitle}>{item.name}</Text>
                <Text style={styles.workoutCardDate}>{formatDate(item.date)}</Text>
              </View>
              <TouchableOpacity onPress={() => deleteWorkout(item.id)}>
                <Ionicons name="trash-outline" size={24} color="#f44336" />
              </TouchableOpacity>
            </View>
            <Text style={styles.workoutCardExercises}>
              {item.exercises.length} exercises
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="barbell-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No workouts yet</Text>
            <Text style={styles.emptySubtext}>Start your first workout!</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={startNewWorkout}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      <Modal visible={showWorkoutModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Workout</Text>
            <TextInput
              style={styles.input}
              placeholder="Workout Name (e.g., Push Day)"
              value={workoutName}
              onChangeText={setWorkoutName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowWorkoutModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={createWorkout}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>
                  Start
                </Text>
              </TouchableOpacity>
            </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  workoutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 8,
  },
  exerciseList: {
    flex: 1,
  },
  exerciseCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  exerciseActions: {
    flexDirection: 'row',
    gap: 12,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  setNumber: {
    width: 50,
    fontSize: 16,
  },
  setInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  addSetButton: {
    marginTop: 8,
    padding: 8,
    alignItems: 'center',
  },
  addSetText: {
    color: '#2196F3',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2196F3',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 2,
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
  workoutCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  workoutCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  workoutCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  workoutCardDate: {
    fontSize: 14,
    color: '#666',
  },
  workoutCardExercises: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 100,
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
    backgroundColor: '#2196F3',
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
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#2196F3',
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#2196F3',
  },
  modalButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButtonTextPrimary: {
    color: '#fff',
  },
  exerciseOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  exerciseOptionName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  exerciseOptionDetails: {
    fontSize: 14,
    color: '#666',
  },
});
