import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function PlateCalculator({ visible, onClose, onSelectWeight }) {
  const { theme } = useTheme();
  const [targetWeight, setTargetWeight] = useState('');
  const [barWeight, setBarWeight] = useState('45'); // Standard barbell
  const [unit, setUnit] = useState('lbs'); // lbs or kg

  const availablePlates = unit === 'lbs' 
    ? [45, 35, 25, 10, 5, 2.5]
    : [25, 20, 15, 10, 5, 2.5, 1.25];

  const calculatePlates = () => {
    const target = parseFloat(targetWeight);
    const bar = parseFloat(barWeight);

    if (isNaN(target) || isNaN(bar) || target <= bar) {
      return null;
    }

    const weightPerSide = (target - bar) / 2;
    const plates = [];
    let remaining = weightPerSide;

    for (const plate of availablePlates) {
      const count = Math.floor(remaining / plate);
      if (count > 0) {
        plates.push({ weight: plate, count });
        remaining -= plate * count;
      }
    }

    return {
      plates,
      remaining: Math.round(remaining * 100) / 100,
      totalPerSide: weightPerSide
    };
  };

  const result = calculatePlates();

  const handleUseWeight = () => {
    if (targetWeight && !isNaN(parseFloat(targetWeight))) {
      onSelectWeight(parseFloat(targetWeight));
      onClose();
    }
  };

  const styles = createStyles(theme);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Plate Calculator</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Unit Toggle */}
            <View style={styles.unitToggle}>
              <TouchableOpacity
                style={[styles.unitButton, unit === 'lbs' && styles.unitButtonActive]}
                onPress={() => setUnit('lbs')}
              >
                <Text style={[styles.unitText, unit === 'lbs' && styles.unitTextActive]}>
                  lbs
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.unitButton, unit === 'kg' && styles.unitButtonActive]}
                onPress={() => setUnit('kg')}
              >
                <Text style={[styles.unitText, unit === 'kg' && styles.unitTextActive]}>
                  kg
                </Text>
              </TouchableOpacity>
            </View>

            {/* Inputs */}
            <View style={styles.inputSection}>
              <Text style={styles.label}>Bar Weight</Text>
              <TextInput
                style={styles.input}
                value={barWeight}
                onChangeText={setBarWeight}
                keyboardType="decimal-pad"
                placeholder={`Bar weight (${unit})`}
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.label}>Target Weight</Text>
              <TextInput
                style={styles.input}
                value={targetWeight}
                onChangeText={setTargetWeight}
                keyboardType="decimal-pad"
                placeholder={`Total weight (${unit})`}
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            {/* Results */}
            {result && (
              <View style={styles.resultSection}>
                <Text style={styles.resultTitle}>Plates per side:</Text>
                
                {result.plates.map((plate, index) => (
                  <View key={index} style={styles.plateRow}>
                    <View style={[styles.plateVisual, { width: plate.weight * 2 }]}>
                      <Text style={styles.plateText}>{plate.weight}</Text>
                    </View>
                    <Text style={styles.plateCount}>× {plate.count}</Text>
                  </View>
                ))}

                {result.remaining > 0 && (
                  <Text style={styles.remainingText}>
                    ⚠️ {result.remaining} {unit} remaining (use smaller plates)
                  </Text>
                )}

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Weight per side:</Text>
                  <Text style={styles.totalValue}>
                    {result.totalPerSide} {unit}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.useButton]}
              onPress={handleUseWeight}
            >
              <Text style={styles.buttonText}>Use This Weight</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (theme) => StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: theme.colors.inputBackground,
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  unitButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  unitText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  unitTextActive: {
    color: '#FFFFFF',
  },
  inputSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.colors.inputBackground,
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  resultSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: theme.colors.inputBackground,
    borderRadius: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
  },
  plateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  plateVisual: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  plateText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  plateCount: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  remainingText: {
    color: theme.colors.warning,
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  buttonContainer: {
    marginTop: 16,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  useButton: {
    backgroundColor: theme.colors.primary,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
