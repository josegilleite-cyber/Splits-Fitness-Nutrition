import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
  Share
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { StorageService } from '../services/storage';
import { exercises } from '../data/exercises';
import { generateId } from '../utils/helpers';

export default function TemplatesScreen() {
  const [templates, setTemplates] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [importText, setImportText] = useState('');

  useEffect(() => {
    loadTemplates();
    initializeDefaultTemplates();
  }, []);

  const loadTemplates = async () => {
    const data = await StorageService.getTemplates();
    setTemplates(data);
  };

  const initializeDefaultTemplates = async () => {
    const alreadyInitialized = await StorageService.hasInitializedTemplates();
    if (alreadyInitialized) {
      return;
    }

    const existing = await StorageService.getTemplates();
    if (existing.length === 0) {
      // Add some default templates
      const defaultTemplates = [
        {
          id: generateId(),
          name: 'Push Day',
          description: 'Chest, shoulders, and triceps workout',
          exercises: [
            { exerciseId: 'bench-press', sets: 4, reps: 8 },
            { exerciseId: 'overhead-press', sets: 3, reps: 10 },
            { exerciseId: 'incline-bench-press', sets: 3, reps: 10 },
            { exerciseId: 'lateral-raises', sets: 3, reps: 12 },
            { exerciseId: 'tricep-pushdown', sets: 3, reps: 12 }
          ]
        },
        {
          id: generateId(),
          name: 'Pull Day',
          description: 'Back and biceps workout',
          exercises: [
            { exerciseId: 'deadlift', sets: 4, reps: 6 },
            { exerciseId: 'pull-ups', sets: 3, reps: 10 },
            { exerciseId: 'barbell-row', sets: 4, reps: 8 },
            { exerciseId: 'bicep-curls', sets: 3, reps: 12 }
          ]
        },
        {
          id: generateId(),
          name: 'Leg Day',
          description: 'Lower body workout',
          exercises: [
            { exerciseId: 'squat', sets: 4, reps: 8 },
            { exerciseId: 'leg-press', sets: 3, reps: 12 },
            { exerciseId: 'leg-curl', sets: 3, reps: 12 },
            { exerciseId: 'leg-extension', sets: 3, reps: 12 },
            { exerciseId: 'calf-raises', sets: 4, reps: 15 }
          ]
        }
      ];

      for (const template of defaultTemplates) {
        await StorageService.saveTemplate(template);
      }
      await StorageService.setTemplatesInitialized();
      loadTemplates();
    }
  };

  const startNewTemplate = () => {
    setTemplateName('');
    setTemplateDescription('');
    setCurrentTemplate({ id: generateId(), exercises: [] });
    setShowCreateModal(true);
  };

  const saveTemplateInfo = () => {
    if (!templateName.trim()) {
      Alert.alert('Error', 'Please enter a template name');
      return;
    }

    setCurrentTemplate({
      ...currentTemplate,
      name: templateName,
      description: templateDescription
    });
    setShowCreateModal(false);
    setShowExerciseSelector(true);
  };

  const addExerciseToTemplate = (exercise, sets, reps) => {
    const templateExercise = {
      exerciseId: exercise.id,
      sets: sets || 3,
      reps: reps || 10
    };

    setCurrentTemplate({
      ...currentTemplate,
      exercises: [...currentTemplate.exercises, templateExercise]
    });
  };

  const removeExerciseFromTemplate = (index) => {
    const updated = { ...currentTemplate };
    updated.exercises.splice(index, 1);
    setCurrentTemplate(updated);
  };

  const saveTemplate = async () => {
    if (!currentTemplate.exercises || currentTemplate.exercises.length === 0) {
      Alert.alert('Error', 'Add at least one exercise to save the template');
      return;
    }

    await StorageService.saveTemplate(currentTemplate);
    setCurrentTemplate(null);
    setShowExerciseSelector(false);
    loadTemplates();
    Alert.alert('Success', 'Template saved successfully!');
  };

  const deleteTemplate = async (templateId) => {
    Alert.alert(
      'Delete Template',
      'Are you sure you want to delete this template?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await StorageService.deleteTemplate(templateId);
            loadTemplates();
          }
        }
      ]
    );
  };

  const exportTemplate = async (template) => {
    try {
      const json = JSON.stringify([template], null, 2);
      
      // Try to share, fallback to clipboard
      try {
        await Share.share({
          message: json,
          title: `Export ${template.name}`
        });
      } catch (shareError) {
        await Clipboard.setStringAsync(json);
        Alert.alert('Exported', 'Template copied to clipboard!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export template');
    }
  };

  const exportAllTemplates = async () => {
    try {
      const json = await StorageService.exportTemplates();
      
      try {
        await Share.share({
          message: json,
          title: 'Export All Templates'
        });
      } catch (shareError) {
        await Clipboard.setStringAsync(json);
        Alert.alert('Exported', 'All templates copied to clipboard!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export templates');
    }
  };

  const importTemplates = async () => {
    try {
      if (!importText.trim()) {
        Alert.alert('Error', 'Please paste template JSON data');
        return;
      }

      await StorageService.importTemplates(importText);
      setImportText('');
      setShowImportModal(false);
      loadTemplates();
      Alert.alert('Success', 'Templates imported successfully!');
    } catch (error) {
      Alert.alert('Error', 'Invalid template data. Please check the JSON format.');
    }
  };

  const pasteFromClipboard = async () => {
    const text = await Clipboard.getStringAsync();
    setImportText(text);
  };

  const getExerciseName = (exerciseId) => {
    const exercise = exercises.find(e => e.id === exerciseId);
    return exercise ? exercise.name : 'Unknown Exercise';
  };

  const useTemplate = (template) => {
    Alert.alert(
      'Use Template',
      `Create a workout from "${template.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create Workout',
          onPress: () => {
            Alert.alert(
              'Info',
              'Go to the Workouts tab to start a new workout. You can manually add exercises from this template.'
            );
          }
        }
      ]
    );
  };

  if (showExerciseSelector && currentTemplate) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => {
            setShowExerciseSelector(false);
            setCurrentTemplate(null);
          }}>
            <Ionicons name="close" size={32} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{currentTemplate.name}</Text>
          <TouchableOpacity onPress={saveTemplate}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.exerciseList}>
            {currentTemplate.exercises.map((ex, index) => (
              <View key={index} style={styles.templateExerciseCard}>
                <View style={styles.templateExerciseInfo}>
                  <Text style={styles.templateExerciseName}>
                    {getExerciseName(ex.exerciseId)}
                  </Text>
                  <Text style={styles.templateExerciseDetails}>
                    {ex.sets} sets × {ex.reps} reps
                  </Text>
                </View>
                <TouchableOpacity onPress={() => removeExerciseFromTemplate(index)}>
                  <Ionicons name="trash" size={24} color="#f44336" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <FlatList
            data={exercises}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.exerciseOption}
                onPress={() => addExerciseToTemplate(item)}
              >
                <View>
                  <Text style={styles.exerciseOptionName}>{item.name}</Text>
                  <Text style={styles.exerciseOptionDetails}>
                    {item.muscleGroups.join(', ')}
                  </Text>
                </View>
                <Ionicons name="add-circle-outline" size={24} color="#2196F3" />
              </TouchableOpacity>
            )}
          />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.toolbarContainer}>
        <TouchableOpacity style={styles.toolbarButton} onPress={exportAllTemplates}>
          <Ionicons name="share-outline" size={20} color="#2196F3" />
          <Text style={styles.toolbarButtonText}>Export All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbarButton} onPress={() => setShowImportModal(true)}>
          <Ionicons name="download-outline" size={20} color="#2196F3" />
          <Text style={styles.toolbarButtonText}>Import</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={templates}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.templateCard}>
            <View style={styles.templateHeader}>
              <View style={styles.templateInfo}>
                <Text style={styles.templateName}>{item.name}</Text>
                <Text style={styles.templateDescription}>{item.description}</Text>
              </View>
              <View style={styles.templateActions}>
                <TouchableOpacity onPress={() => exportTemplate(item)}>
                  <Ionicons name="share-outline" size={24} color="#2196F3" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTemplate(item.id)}>
                  <Ionicons name="trash-outline" size={24} color="#f44336" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.templateExercises}>
              {item.exercises.map((ex, index) => (
                <Text key={index} style={styles.templateExerciseText}>
                  • {getExerciseName(ex.exerciseId)} - {ex.sets}×{ex.reps}
                </Text>
              ))}
            </View>

            <TouchableOpacity
              style={styles.useTemplateButton}
              onPress={() => useTemplate(item)}
            >
              <Text style={styles.useTemplateButtonText}>Use Template</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No templates yet</Text>
            <Text style={styles.emptySubtext}>Create your first workout template!</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={startNewTemplate}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      <Modal visible={showCreateModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Template</Text>
            <TextInput
              style={styles.input}
              placeholder="Template Name (e.g., Upper Body)"
              value={templateName}
              onChangeText={setTemplateName}
              autoFocus
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description (optional)"
              value={templateDescription}
              onChangeText={setTemplateDescription}
              multiline
              numberOfLines={3}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setShowCreateModal(false);
                  setCurrentTemplate(null);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={saveTemplateInfo}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showImportModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Import Templates</Text>
            <TouchableOpacity onPress={() => setShowImportModal(false)}>
              <Ionicons name="close" size={32} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.importContent}>
            <Text style={styles.importInstructions}>
              Paste template JSON data below:
            </Text>
            <TouchableOpacity style={styles.pasteButton} onPress={pasteFromClipboard}>
              <Ionicons name="clipboard-outline" size={20} color="#2196F3" />
              <Text style={styles.pasteButtonText}>Paste from Clipboard</Text>
            </TouchableOpacity>
            <TextInput
              style={[styles.input, styles.importTextArea]}
              placeholder="Paste JSON data here..."
              value={importText}
              onChangeText={setImportText}
              multiline
              numberOfLines={10}
            />
            <TouchableOpacity style={styles.importButton} onPress={importTemplates}>
              <Text style={styles.importButtonText}>Import Templates</Text>
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
  toolbarContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    gap: 12,
  },
  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#2196F3',
    gap: 4,
  },
  toolbarButtonText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '500',
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  saveText: {
    fontSize: 18,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  exerciseList: {
    padding: 16,
  },
  templateExerciseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  templateExerciseInfo: {
    flex: 1,
  },
  templateExerciseName: {
    fontSize: 16,
    fontWeight: '500',
  },
  templateExerciseDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  templateCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 14,
    color: '#666',
  },
  templateActions: {
    flexDirection: 'row',
    gap: 12,
  },
  templateExercises: {
    marginBottom: 12,
  },
  templateExerciseText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  useTemplateButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  useTemplateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  exerciseOptionName: {
    fontSize: 16,
    fontWeight: '500',
  },
  exerciseOptionDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  importContent: {
    flex: 1,
    padding: 16,
  },
  importInstructions: {
    fontSize: 16,
    marginBottom: 12,
    color: '#666',
  },
  pasteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#2196F3',
    marginBottom: 12,
    gap: 8,
  },
  pasteButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '500',
  },
  importTextArea: {
    height: 200,
    textAlignVertical: 'top',
    fontFamily: 'monospace',
  },
  importButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 12,
  },
  importButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
