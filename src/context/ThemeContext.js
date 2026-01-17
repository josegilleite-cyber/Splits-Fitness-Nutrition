import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const lightTheme = {
  dark: false,
  colors: {
    background: '#F5F5F5',
    card: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    primary: '#4A90E2',
    secondary: '#5DADE2',
    success: '#4CAF50',
    danger: '#F44336',
    warning: '#FF9800',
    border: '#E0E0E0',
    inputBackground: '#F8F8F8',
    shadow: '#000000',
    chartLine: '#4A90E2',
    chartBackground: '#FFFFFF',
  }
};

export const darkTheme = {
  dark: true,
  colors: {
    background: '#0A0E17',
    card: '#1C2133',
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    primary: '#5DADE2',
    secondary: '#4A90E2',
    success: '#4CAF50',
    danger: '#F44336',
    warning: '#FF9800',
    border: '#2A3142',
    inputBackground: '#151B2D',
    shadow: '#000000',
    chartLine: '#5DADE2',
    chartBackground: '#1C2133',
  }
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@theme_preference');
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    try {
      await AsyncStorage.setItem('@theme_preference', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
