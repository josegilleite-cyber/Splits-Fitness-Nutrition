import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Linking,
  Image,
  ScrollView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ExerciseVideoModal({ visible, exercise, onClose }) {
  if (!exercise) return null;

  const openVideo = () => {
    if (exercise.videoUrl) {
      Linking.openURL(exercise.videoUrl);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#2DB98C';
      case 'Intermediate': return '#F39C12';
      case 'Advanced': return '#E74C3C';
      default: return '#4A90E2';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{exercise.name}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Video Thumbnail */}
            {exercise.thumbnailUrl && (
              <TouchableOpacity
                style={styles.videoContainer}
                onPress={openVideo}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: exercise.thumbnailUrl }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
                <View style={styles.playOverlay}>
                  <View style={styles.playButton}>
                    <Ionicons name="play" size={40} color="white" />
                  </View>
                  <Text style={styles.watchText}>Watch Tutorial</Text>
                </View>
              </TouchableOpacity>
            )}

            {/* Exercise Info */}
            <View style={styles.infoSection}>
              {/* Badges */}
              <View style={styles.badgesRow}>
                <View style={[styles.badge, { backgroundColor: getDifficultyColor(exercise.difficulty) }]}>
                  <Text style={styles.badgeText}>{exercise.difficulty}</Text>
                </View>
                <View style={styles.badge}>
                  <Ionicons name="barbell-outline" size={16} color="white" style={styles.badgeIcon} />
                  <Text style={styles.badgeText}>{exercise.equipment}</Text>
                </View>
                {exercise.isPremium && (
                  <View style={[styles.badge, styles.premiumBadge]}>
                    <Ionicons name="star" size={16} color="#FFD700" style={styles.badgeIcon} />
                    <Text style={styles.badgeText}>Premium</Text>
                  </View>
                )}
              </View>

              {/* Description */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.descriptionText}>{exercise.description}</Text>
              </View>

              {/* Muscle Groups */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Target Muscles</Text>
                <View style={styles.muscleContainer}>
                  {exercise.muscleGroups.map((muscle, index) => (
                    <View key={index} style={styles.muscleChip}>
                      <Ionicons name="fitness-outline" size={16} color="#4A90E2" />
                      <Text style={styles.muscleText}>{muscle}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Tips */}
              {exercise.tips && exercise.tips.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    <Ionicons name="bulb-outline" size={18} color="#F39C12" /> Form Tips
                  </Text>
                  {exercise.tips.map((tip, index) => (
                    <View key={index} style={styles.tipRow}>
                      <View style={styles.tipBullet}>
                        <Text style={styles.tipBulletText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Alternatives */}
              {exercise.alternatives && exercise.alternatives.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Alternative Exercises</Text>
                  <Text style={styles.alternativesText}>
                    {exercise.alternatives.join(', ').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Text>
                </View>
              )}
            </View>

            {/* Action Button */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={openVideo}
            >
              <Ionicons name="play-circle" size={24} color="white" />
              <Text style={styles.actionButtonText}>Watch Full Tutorial</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '90%',
    paddingBottom: 20
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    flex: 1
  },
  closeButton: {
    padding: 5
  },
  videoContainer: {
    width: '100%',
    height: 220,
    backgroundColor: '#000',
    position: 'relative'
  },
  thumbnail: {
    width: '100%',
    height: '100%'
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(74, 144, 226, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  watchText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  infoSection: {
    padding: 20
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8
  },
  premiumBadge: {
    backgroundColor: '#1A1A1A'
  },
  badgeIcon: {
    marginRight: 4
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600'
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12
  },
  descriptionText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22
  },
  muscleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  muscleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8
  },
  muscleText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500'
  },
  tipRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start'
  },
  tipBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2
  },
  tipBulletText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold'
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#555',
    lineHeight: 20
  },
  alternativesText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 16,
    borderRadius: 12
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10
  }
});
