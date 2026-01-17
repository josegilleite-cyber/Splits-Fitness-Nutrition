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
import { useTheme } from '../context/ThemeContext';
import { StorageService } from '../services/storage';
import { exercises } from '../data/exercises';
import { generateId, formatDate, generateProgressEntry } from '../utils/helpers';
import RestTimer from '../components/RestTimer';
import ExerciseVideoModal from '../components/ExerciseVideoModal';
import PlateCalculator from '../components/PlateCalculator';

export default function WorkoutsScreen() {
  const { theme } = useTheme();
  const [workouts, setWorkouts] = useState([]);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [showPlateCalc, setShowPlateCalc] = useState(false);
  const [plateCalcTarget, setPlateCalcTarget] = useState({ exerciseIndex: 0, setIndex: 0 });
  const [workoutName, setWorkoutName] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [personalRecords, setPersonalRecords] = useState({});

  useEffect(() => {
    loadWorkouts();
    loadPersonalRecords();
  }, []);

  const loadWorkouts = async () => {
    const data = await StorageService.getWorkouts();
    setWorkouts(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  const loadPersonalRecords = async () => {
    const records = await StorageService.getPersonalRecords();
    setPersonalRecords(records);
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
    const exerciseSets = updated.exercises[exerciseIndex].sets;
    exerciseSets[setIndex].completed = !exerciseSets[setIndex].completed;
    setCurrentWorkout(updated);
    
    // Check for new PR
    if (exerciseSets[setIndex].completed) {
      const exerciseId = updated.exercises[exerciseIndex].exerciseId;
      const weight = exerciseSets[setIndex].weight;
      const reps = exerciseSets[setIndex].reps;
      checkAndUpdatePR(exerciseId, weight, reps);
      setShowRestTimer(true);
    }
  };

  const checkAndUpdatePR = async (exerciseId, weight, reps) => {
    const pr = personalRecords[exerciseId];
    let isNewPR = false;
    
    if (!pr || weight > pr.maxWeight.weight) {
      isNewPR = true;
      await StorageService.updatePersonalRecord(exerciseId, weight, reps, new Date().toISOString());
      await loadPersonalRecords();
      
      const exerciseName = getExerciseName(exerciseId);
      Alert.alert('🎉 New Personal Record!', `${exerciseName}\n${weight} lbs × ${reps} reps`);
    }
  };

  const openPlateCalculator = (exerciseIndex, setIndex) => {
    setPlateCalcTarget({ exerciseIndex, setIndex });
    setShowPlateCalc(true);
  };

  const handlePlateCalcWeight = (weight) => {
    const { exerciseIndex, setIndex } = plateCalcTarget;
    updateSet(exerciseIndex, setIndex, 'weight', weight);
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

  const styles = createStyles(theme);

  if (currentWorkout) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.workoutTitle}>{currentWorkout.name}</Text>
            <Text style={styles.headerSubtitle}>{formatDate(new Date())}</Text>
          </View>
          <TouchableOpacity onPress={() => setShowExerciseSelector(true)} style={styles.addButton}>
            <Ionicons name="add" size={28} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.exerciseList} showsVerticalScrollIndicator={false}>
          {currentWorkout.exercises.map((exercise, exerciseIndex) => {
            const pr = personalRecords[exercise.exerciseId];
            return (
              <View key={exercise.id} style={styles.exerciseCard}>
                <View style={styles.exerciseHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.exerciseName}>{getExerciseName(exercise.exerciseId)}</Text>
                    {pr && (
                      <Text style={styles.prText}>
                        PR: {pr.maxWeight.weight} lbs × {pr.maxWeight.reps}
                      </Text>
                    )}
                  </View>
                  <View style={styles.exerciseActions}>
                    <TouchableOpacity onPress={() => suggestAlternative(exercise.exerciseId)}>
                      <Ionicons name="swap-horizontal" size={24} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => removeExercise(exerciseIndex)}>
                      <Ionicons name="trash-outline" size={22} color={theme.colors.danger} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Set Header */}
                <View style={styles.setHeader}>
                  <Text style={[styles.setHeaderText, { width: 40 }]}>SET</Text>
                  <Text style={[styles.setHeaderText, { flex: 1, textAlign: 'center' }]}>PREVIOUS</Text>
                  <Text style={[styles.setHeaderText, { width: 60, textAlign: 'center' }]}>REPS</Text>
                  <Text style={[styles.setHeaderText, { width: 60, textAlign: 'center' }]}>WEIGHT</Text>
                  <View style={{ width: 40 }} />
                </View>

                {exercise.sets.map((set, setIndex) => (
                  <View key={set.id} style={styles.setRow}>
                    <Text style={[styles.setText, { width: 40 }]}>{setIndex + 1}</Text>
                    
                    <Text style={[styles.previousText, { flex: 1, textAlign: 'center' }]}>
                      {set.weight > 0 ? `${set.reps} × ${set.weight}` : '-'}
                    </Text>
                    
                    <TextInput
                      style={[styles.setInput, { width: 60 }]}
                      placeholder="0"
                      placeholderTextColor={theme.colors.textSecondary}
                      keyboardType="numeric"
                      value={set.reps > 0 ? set.reps.toString() : ''}
                      onChangeText={(text) => updateSet(exerciseIndex, setIndex, 'reps', parseInt(text) || 0)}
                    />
                    
                    <View style={{ width: 60, position: 'relative' }}>
                      <TextInput
                        style={styles.setInput}
                        placeholder="0"
                        placeholderTextColor={theme.colors.textSecondary}
                        keyboardType="decimal-pad"
                        value={set.weight > 0 ? set.weight.toString() : ''}
                        onChangeText={(text) => updateSet(exerciseIndex, setIndex, 'weight', parseFloat(text) || 0)}
                      />
                      <TouchableOpacity 
                        style={styles.plateButton}
                        onPress={() => openPlateCalculator(exerciseIndex, setIndex)}
                      >
                        <Ionicons name="calculator" size={14} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity 
                      onPress={() => toggleSetComplete(exerciseIndex, setIndex)}
                      style={styles.checkButton}
                    >
                      <Ionicons
                        name={set.completed ? "checkmark-circle" : "ellipse-outline"}
                        size={32}
                        color={set.completed ? theme.colors.success : theme.colors.border}
                      />
                    </TouchableOpacity>
                  </View>
                ))}

                <TouchableOpacity onPress={() => addSet(exerciseIndex)} style={styles.addSetButton}>
                  <Ionicons name="add-circle-outline" size={20} color={theme.colors.primary} />
                  <Text style={styles.addSetText}>Add Set</Text>
                </TouchableOpacity>
              </View>
            );
          })}
          
          <View style={{ height: 100 }} />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => setCurrentWorkout(null)} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={saveWorkout} style={styles.saveButton}>
            <Ionicons name="checkmark" size={24} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Finish Workout</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={showExerciseSelector} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Exercise</Text>
              <TouchableOpacity onPress={() => setShowExerciseSelector(false)}>
                <Ionicons name="close" size={28} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={exercises}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.exerciseOptionContainer}>
                  <TouchableOpacity
                    style={styles.exerciseOption}
                    onPress={() => addExerciseToWorkout(item)}
                  >
                    <View style={styles.exerciseOptionContent}>
                      <View style={styles.exerciseInfo}>
                        <Text style={styles.exerciseOptionName}>{item.name}</Text>
                        <Text style={styles.exerciseOptionDetails}>
                          {item.muscleGroups.join(', ')} • {item.equipment}
                        </Text>
                        {item.isPremium && (
                          <View style={styles.premiumBadgeSmall}>
                            <Ionicons name="star" size={12} color="#FFD700" />
                            <Text style={styles.premiumText}>Premium</Text>
                          </View>
                        )}
                      </View>
                      {item.videoUrl && (
                        <TouchableOpacity
                          style={styles.infoButton}
                          onPress={() => {
                            setSelectedExercise(item);
                            setShowVideoModal(true);
                          }}
                        >
                          <Ionicons name="information-circle-outline" size={28} color={theme.colors.primary} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        </Modal>

        <RestTimer visible={showRestTimer} onClose={() => setShowRestTimer(false)} />
        <PlateCalculator 
          visible={showPlateCalc} 
          onClose={() => setShowPlateCalc(false)}
          onSelectWeight={handlePlateCalcWeight}
        />
        <ExerciseVideoModal 
          visible={showVideoModal} 
          exercise={selectedExercise} 
          onClose={() => setShowVideoModal(false)} 
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.workoutCard}>
            <View style={styles.workoutCardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.workoutCardTitle}>{item.name}</Text>
                <Text style={styles.workoutCardDate}>{formatDate(item.date)}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => deleteWorkout(item.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={22} color={theme.colors.danger} />
              </TouchableOpacity>
            </View>
            <View style={styles.workoutCardStats}>
              <View style={styles.statItem}>
                <Ionicons name="barbell-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={styles.statText}>{item.exercises.length} exercises</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="checkmark-circle-outline" size={16} color={theme.colors.success} />
                <Text style={styles.statText}>
                  {item.exercises.reduce((sum, ex) => sum + ex.sets.filter(s => s.completed).length, 0)} sets
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="barbell-outline" size={64} color={theme.colors.border} />
            <Text style={styles.emptyText}>No workouts yet</Text>
            <Text style={styles.emptySubtext}>Tap + to start your first workout</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={startNewWorkout}>
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal visible={showWorkoutModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalContentTitle}>Start Workout</Text>
            <TextInput
              style={styles.input}
              placeholder="Workout Name"
              placeholderTextColor={theme.colors.textSecondary}
              value={workoutName}
              onChangeText={setWorkoutName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setShowWorkoutModal(false)}
              >
                <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={createWorkout}
              >
                <Text style={styles.modalButtonTextPrimary}>Start</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  workoutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  addButton: {
    padding: 8,
  },
  exerciseList: {
    flex: 1,
  },
  exerciseCard: {
    backgroundColor: theme.colors.card,
    marginHorizontal: 12,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  prText: {
    fontSize: 12,
    color: theme.colors.primary,
    marginTop: 4,
    fontWeight: '600',
  },
  exerciseActions: {
    flexDirection: 'row',
    gap: 16,
  },
  setHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginBottom: 8,
  },
  setHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  setText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  previousText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  setInput: {
    backgroundColor: theme.colors.inputBackground,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
  plateButton: {
    position: 'absolute',
    right: 2,
    top: 2,
    backgroundColor: theme.colors.card,
    borderRadius: 4,
    padding: 2,
  },
  checkButton: {
    width: 40,
    alignItems: 'center',
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 10,
    gap: 6,
  },
  addSetText: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  saveButton: {
    flex: 2,
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  workoutCard: {
    backgroundColor: theme.colors.card,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  workoutCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  workoutCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  workoutCardDate: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  workoutCardStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  deleteButton: {
    padding: 4,
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
    color: theme.colors.textSecondary,
  },
  emptySubtext: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: 8,
    opacity: 0.7,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalContentTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  input: {
    backgroundColor: theme.colors.inputBackground,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonSecondary: {
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: 'transparent',
  },
  modalButtonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  modalButtonTextSecondary: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  modalButtonTextPrimary: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  exerciseOptionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  exerciseOption: {
    padding: 16,
    backgroundColor: theme.colors.card,
  },
  exerciseOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseOptionName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  exerciseOptionDetails: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  premiumBadgeSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.dark ? '#2A2A2A' : '#1A1A1A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  premiumText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  infoButton: {
    padding: 8,
    marginLeft: 8,
  },
});
