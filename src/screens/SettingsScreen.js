import React from 'react';
import { withSafeArea } from '../components/withSafeArea';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

function SettingsScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const styles = createStyles(theme);

  const settingSections = [
    {
      title: 'Appearance',
      items: [
        {
          icon: 'moon',
          label: 'Dark Mode',
          type: 'switch',
          value: isDark,
          onPress: toggleTheme,
        },
      ],
    },
    {
      title: 'Workout',
      items: [
        {
          icon: 'timer',
          label: 'Default Rest Time',
          type: 'text',
          value: '90s',
        },
        {
          icon: 'barbell',
          label: 'Default Bar Weight',
          type: 'text',
          value: '45 lbs',
        },
      ],
    },
    {
      title: 'Data',
      items: [
        {
          icon: 'download',
          label: 'Export All Data',
          type: 'button',
        },
        {
          icon: 'trash',
          label: 'Clear All Data',
          type: 'button',
          danger: true,
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          icon: 'information-circle',
          label: 'Version',
          type: 'text',
          value: '1.0.0',
        },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {settingSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          
          {section.items.map((item, itemIndex) => (
            <View key={itemIndex}>
              <TouchableOpacity
                style={styles.settingItem}
                onPress={item.onPress}
                disabled={item.type === 'switch'}
              >
                <View style={styles.settingLeft}>
                  <Ionicons 
                    name={item.icon} 
                    size={22} 
                    color={item.danger ? theme.colors.danger : theme.colors.primary} 
                  />
                  <Text style={[
                    styles.settingLabel,
                    item.danger && styles.dangerText
                  ]}>
                    {item.label}
                  </Text>
                </View>
                
                <View style={styles.settingRight}>
                  {item.type === 'switch' && (
                    <Switch
                      value={item.value}
                      onValueChange={item.onPress}
                      trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                      thumbColor="#FFFFFF"
                    />
                  )}
                  {item.type === 'text' && (
                    <Text style={styles.settingValue}>{item.value}</Text>
                  )}
                  {item.type === 'button' && (
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                  )}
                </View>
              </TouchableOpacity>
              
              {itemIndex < section.items.length - 1 && (
                <View style={styles.divider} />
              )}
            </View>
          ))}
        </View>
      ))}
      
      <Text style={styles.footer}>
        Splits Fitness & Nutrition
        {'\n'}
        Privacy-first workout tracking
      </Text>
    </ScrollView>
  );
}

export default withSafeArea(SettingsScreen);

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  section: {
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: 12,
    fontWeight: '500',
  },
  dangerText: {
    color: theme.colors.danger,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    marginRight: 4,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginLeft: 54,
  },
  footer: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: 13,
    marginVertical: 30,
    lineHeight: 20,
  },
});
