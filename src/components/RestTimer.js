import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scheduleRestTimerNotification, cancelAllNotifications } from '../utils/notifications';

export default function RestTimer({ visible, onClose }) {
  const [timeLeft, setTimeLeft] = useState(90); // Default 90 seconds
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTime, setSelectedTime] = useState(90);
  const [progress] = useState(new Animated.Value(1));

  useEffect(() => {
    if (visible) {
      setTimeLeft(selectedTime);
      setIsRunning(false);
    }
  }, [visible]);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          
          if (newTime === 0) {
            setIsRunning(false);
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);
  
  // Separate effect for progress animation
  useEffect(() => {
    if (isRunning) {
      Animated.timing(progress, {
        toValue: timeLeft / selectedTime,
        duration: 1000,
        useNativeDriver: false
      }).start();
    }
  }, [timeLeft, isRunning]);

  const startTimer = async () => {
    setIsRunning(true);
    await scheduleRestTimerNotification(timeLeft);
  };

  const pauseTimer = async () => {
    setIsRunning(false);
    await cancelAllNotifications();
  };

  const resetTimer = async () => {
    setIsRunning(false);
    setTimeLeft(selectedTime);
    progress.setValue(1);
    await cancelAllNotifications();
  };

  const selectTime = (seconds) => {
    setSelectedTime(seconds);
    setTimeLeft(seconds);
    progress.setValue(1);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClose = async () => {
    await cancelAllNotifications();
    setIsRunning(false);
    onClose();
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  const timePresets = [
    { label: '60s', value: 60 },
    { label: '90s', value: 90 },
    { label: '120s', value: 120 },
    { label: '180s', value: 180 }
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Rest Timer</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={32} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.timerContainer}>
            <Text style={[styles.timer, timeLeft <= 10 && styles.timerWarning]}>
              {formatTime(timeLeft)}
            </Text>
            
            <View style={styles.progressBarContainer}>
              <Animated.View 
                style={[
                  styles.progressBar, 
                  { width: progressWidth },
                  timeLeft <= 10 && styles.progressBarWarning
                ]} 
              />
            </View>
          </View>

          <View style={styles.presetsContainer}>
            {timePresets.map((preset) => (
              <TouchableOpacity
                key={preset.value}
                style={[
                  styles.presetButton,
                  selectedTime === preset.value && styles.presetButtonActive
                ]}
                onPress={() => selectTime(preset.value)}
                disabled={isRunning}
              >
                <Text style={[
                  styles.presetText,
                  selectedTime === preset.value && styles.presetTextActive
                ]}>
                  {preset.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.controls}>
            {!isRunning ? (
              <TouchableOpacity
                style={styles.startButton}
                onPress={startTimer}
                disabled={timeLeft === 0}
              >
                <Ionicons name="play" size={32} color="#fff" />
                <Text style={styles.controlText}>Start</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.pauseButton} onPress={pauseTimer}>
                <Ionicons name="pause" size={32} color="#fff" />
                <Text style={styles.controlText}>Pause</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
              <Ionicons name="refresh" size={32} color="#2196F3" />
              <Text style={[styles.controlText, styles.resetText]}>Reset</Text>
            </TouchableOpacity>
          </View>

          {timeLeft === 0 && (
            <View style={styles.completeContainer}>
              <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
              <Text style={styles.completeText}>Rest Complete!</Text>
              <Text style={styles.completeSubtext}>Ready for your next set</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    minHeight: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  timer: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 16,
  },
  timerWarning: {
    color: '#f44336',
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2196F3',
  },
  progressBarWarning: {
    backgroundColor: '#f44336',
  },
  presetsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 8,
  },
  presetButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  presetButtonActive: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  presetText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  presetTextActive: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  startButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  pauseButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9800',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2196F3',
    gap: 8,
  },
  controlText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetText: {
    color: '#2196F3',
  },
  completeContainer: {
    alignItems: 'center',
    marginTop: 24,
    padding: 16,
  },
  completeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 12,
  },
  completeSubtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
});
