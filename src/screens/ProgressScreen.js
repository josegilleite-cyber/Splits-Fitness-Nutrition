import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Modal,
  FlatList
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { StorageService } from '../services/storage';
import { exercises } from '../data/exercises';
import { formatDate } from '../utils/helpers';

const screenWidth = Dimensions.get('window').width;

export default function ProgressScreen() {
  const [progressData, setProgressData] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseProgress, setExerciseProgress] = useState([]);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);

  useEffect(() => {
    loadProgressData();
  }, []);

  useEffect(() => {
    if (selectedExercise) {
      loadExerciseProgress(selectedExercise);
    }
  }, [selectedExercise]);

  const loadProgressData = async () => {
    const data = await StorageService.getProgressData();
    setProgressData(data);
    
    // Auto-select first exercise with data
    if (data.length > 0 && !selectedExercise) {
      const firstExerciseId = data[0].exerciseId;
      setSelectedExercise(firstExerciseId);
    }
  };

  const loadExerciseProgress = async (exerciseId) => {
    const data = await StorageService.getProgressForExercise(exerciseId);
    setExerciseProgress(data);
  };

  const getExerciseName = (exerciseId) => {
    const exercise = exercises.find(e => e.id === exerciseId);
    return exercise ? exercise.name : 'Unknown Exercise';
  };

  const getUniqueExercises = () => {
    const exerciseIds = [...new Set(progressData.map(p => p.exerciseId))];
    return exerciseIds.map(id => ({
      id,
      name: getExerciseName(id)
    }));
  };

  const prepareChartData = (dataKey) => {
    if (!exerciseProgress || exerciseProgress.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{ data: [0] }]
      };
    }

    // Get last 10 entries for the chart
    const recentData = exerciseProgress.slice(-10);
    
    return {
      labels: recentData.map(d => {
        const date = new Date(d.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      datasets: [{
        data: recentData.map(d => d[dataKey]),
        color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
        strokeWidth: 2
      }]
    };
  };

  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#2196F3'
    }
  };

  const calculateProgress = () => {
    if (exerciseProgress.length < 2) return null;

    const first = exerciseProgress[0];
    const last = exerciseProgress[exerciseProgress.length - 1];

    const weightIncrease = last.maxWeight - first.maxWeight;
    const volumeIncrease = last.totalVolume - first.totalVolume;

    return {
      weightChange: weightIncrease,
      weightPercent: first.maxWeight > 0 ? (weightIncrease / first.maxWeight * 100) : 0,
      volumeChange: volumeIncrease,
      volumePercent: first.totalVolume > 0 ? (volumeIncrease / first.totalVolume * 100) : 0,
      workouts: exerciseProgress.length
    };
  };

  const progress = calculateProgress();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.exerciseSelector}
          onPress={() => setShowExerciseSelector(true)}
        >
          <Text style={styles.exerciseSelectorText}>
            {selectedExercise ? getExerciseName(selectedExercise) : 'Select Exercise'}
          </Text>
          <Ionicons name="chevron-down" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {selectedExercise && exerciseProgress.length > 0 ? (
          <>
            {progress && (
              <View style={styles.statsCard}>
                <Text style={styles.cardTitle}>Overall Progress</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{progress.workouts}</Text>
                    <Text style={styles.statLabel}>Total Workouts</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, styles.statValuePositive]}>
                      +{progress.weightChange.toFixed(1)} lbs
                    </Text>
                    <Text style={styles.statLabel}>Max Weight</Text>
                    <Text style={styles.statPercent}>
                      {progress.weightPercent > 0 ? '+' : ''}{progress.weightPercent.toFixed(1)}%
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statValue, styles.statValuePositive]}>
                      +{Math.round(progress.volumeChange)} lbs
                    </Text>
                    <Text style={styles.statLabel}>Total Volume</Text>
                    <Text style={styles.statPercent}>
                      {progress.volumePercent > 0 ? '+' : ''}{progress.volumePercent.toFixed(1)}%
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.chartCard}>
              <Text style={styles.cardTitle}>Max Weight Progress</Text>
              <LineChart
                data={prepareChartData('maxWeight')}
                width={screenWidth - 48}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                yAxisSuffix=" lbs"
              />
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.cardTitle}>Total Volume Progress</Text>
              <LineChart
                data={prepareChartData('totalVolume')}
                width={screenWidth - 48}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                yAxisSuffix=" lbs"
              />
            </View>

            <View style={styles.historyCard}>
              <Text style={styles.cardTitle}>Workout History</Text>
              {exerciseProgress.map((entry, index) => (
                <View key={index} style={styles.historyItem}>
                  <View>
                    <Text style={styles.historyDate}>{formatDate(entry.date)}</Text>
                    <Text style={styles.historyDetails}>
                      Max: {entry.maxWeight} lbs • Volume: {Math.round(entry.totalVolume)} lbs
                    </Text>
                  </View>
                </View>
              )).reverse()}
            </View>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="stats-chart-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No progress data</Text>
            <Text style={styles.emptySubtext}>
              {selectedExercise 
                ? 'Complete workouts to track your progress' 
                : 'Select an exercise to view progress'}
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal visible={showExerciseSelector} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Exercise</Text>
            <TouchableOpacity onPress={() => setShowExerciseSelector(false)}>
              <Ionicons name="close" size={32} color="#333" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={getUniqueExercises()}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.exerciseOption,
                  selectedExercise === item.id && styles.exerciseOptionSelected
                ]}
                onPress={() => {
                  setSelectedExercise(item.id);
                  setShowExerciseSelector(false);
                }}
              >
                <Text style={styles.exerciseOptionName}>{item.name}</Text>
                {selectedExercise === item.id && (
                  <Ionicons name="checkmark" size={24} color="#2196F3" />
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No exercises tracked yet</Text>
                <Text style={styles.emptySubtext}>Complete a workout to start tracking progress</Text>
              </View>
            }
          />
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  exerciseSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  exerciseSelectorText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  statsCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  chartCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  historyCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statValuePositive: {
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statPercent: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 2,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyDate: {
    fontSize: 16,
    fontWeight: '500',
  },
  historyDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  emptyContainer: {
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
    textAlign: 'center',
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
  exerciseOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  exerciseOptionSelected: {
    backgroundColor: '#E3F2FD',
  },
  exerciseOptionName: {
    fontSize: 16,
    fontWeight: '500',
  },
});
