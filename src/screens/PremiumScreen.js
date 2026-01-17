import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function PremiumScreen() {
  const { theme } = useTheme();
  const [isPremium, setIsPremium] = useState(false);
  const styles = createStyles(theme);

  const premiumFeatures = [
    { icon: 'fitness', title: '6 Hypertrophy Programs', description: 'Science-based programs for maximum muscle growth' },
    { icon: 'barbell', title: '25+ Premium Exercises', description: 'Advanced exercises with video tutorials' },
    { icon: 'videocam', title: 'HD Video Tutorials', description: 'Professional form guides for every premium exercise' },
    { icon: 'analytics', title: 'Advanced Analytics', description: 'Detailed progress tracking and insights' },
    { icon: 'flash', title: 'Custom Routines', description: 'Create unlimited custom workout programs' },
    { icon: 'download', title: 'Offline Access', description: 'Download programs for offline training' },
    { icon: 'trophy', title: 'Achievement System', description: 'Unlock badges and track milestones' },
    { icon: 'people', title: 'Priority Support', description: '24/7 premium customer support' },
  ];

  const plans = [
    { id: 'monthly', name: 'Monthly', price: '$9.99', period: '/month', features: ['All Premium Features', 'Cancel Anytime'], popular: false },
    { id: 'yearly', name: 'Yearly', price: '$79.99', period: '/year', originalPrice: '$119.88', savings: 'Save 33%', features: ['All Premium Features', '2 Months Free', 'Best Value'], popular: true },
    { id: 'lifetime', name: 'Lifetime', price: '$199.99', period: 'one-time', features: ['All Premium Features', 'Lifetime Updates', 'One-Time Payment'], popular: false },
  ];

  const handlePurchase = async (planId) => {
    Alert.alert('Unlock Premium', 'This is a demo. In production, this would process your payment.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Activate Demo Premium', onPress: () => { setIsPremium(true); Alert.alert('Success!', 'Premium features unlocked! 🎉'); } },
    ]);
  };

  if (isPremium) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.activatedContainer}>
          <Ionicons name="checkmark-circle" size={80} color={theme.colors.success} />
          <Text style={styles.activatedTitle}>Premium Active! 🎉</Text>
          <Text style={styles.activatedText}>You have access to all premium features</Text>
          <View style={styles.featuresGrid}>
            {premiumFeatures.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <Ionicons name={feature.icon} size={32} color={theme.colors.primary} />
                <Text style={styles.featureCardTitle}>{feature.title}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.heroIcon}>
          <Ionicons name="star" size={60} color="#FFD700" />
        </View>
        <Text style={styles.heroTitle}>Unlock Premium</Text>
        <Text style={styles.heroSubtitle}>Take your training to the next level</Text>
      </View>
      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>Premium Features</Text>
        {premiumFeatures.map((feature, index) => (
          <View key={index} style={styles.feature}>
            <View style={styles.featureIcon}>
              <Ionicons name={feature.icon} size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
          </View>
        ))}
      </View>
      <View style={styles.plansContainer}>
        <Text style={styles.sectionTitle}>Choose Your Plan</Text>
        {plans.map((plan) => (
          <TouchableOpacity key={plan.id} style={[styles.planCard, plan.popular && styles.popularPlan]} onPress={() => handlePurchase(plan.id)}>
            {plan.popular && (<View style={styles.popularBadge}><Text style={styles.popularBadgeText}>MOST POPULAR</Text></View>)}
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plan.name}</Text>
              {plan.savings && (<View style={styles.savingsBadge}><Text style={styles.savingsText}>{plan.savings}</Text></View>)}
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.planPrice}>{plan.price}</Text>
              <Text style={styles.planPeriod}>{plan.period}</Text>
            </View>
            {plan.originalPrice && (<Text style={styles.originalPrice}>{plan.originalPrice}</Text>)}
            <View style={styles.planFeatures}>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.planFeature}>
                  <Ionicons name="checkmark" size={18} color={theme.colors.success} />
                  <Text style={styles.planFeatureText}>{feature}</Text>
                </View>
              ))}
            </View>
            <View style={styles.selectButton}><Text style={styles.selectButtonText}>Select Plan</Text></View>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.footer}>Premium subscriptions will be charged to your App Store account.{'\n'}Subscriptions auto-renew unless turned off 24 hours before end of period.</Text>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const createStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  hero: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  heroIcon: { width: 120, height: 120, borderRadius: 60, backgroundColor: theme.dark ? 'rgba(255, 215, 0, 0.1)' : '#FFF9E5', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  heroTitle: { fontSize: 32, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 },
  heroSubtitle: { fontSize: 16, color: theme.colors.textSecondary, textAlign: 'center' },
  featuresContainer: { paddingHorizontal: 20, marginBottom: 30 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: theme.colors.text, marginBottom: 20 },
  feature: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.card, padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: theme.colors.border },
  featureIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: theme.dark ? 'rgba(93, 173, 226, 0.1)' : '#E3F2FD', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  featureContent: { flex: 1 },
  featureTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text, marginBottom: 4 },
  featureDescription: { fontSize: 14, color: theme.colors.textSecondary },
  plansContainer: { paddingHorizontal: 20, marginBottom: 20 },
  planCard: { backgroundColor: theme.colors.card, borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 2, borderColor: theme.colors.border },
  popularPlan: { borderColor: theme.colors.primary, borderWidth: 3 },
  popularBadge: { position: 'absolute', top: -12, alignSelf: 'center', backgroundColor: theme.colors.primary, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  popularBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  planName: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text },
  savingsBadge: { backgroundColor: theme.colors.success, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  savingsText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 8 },
  planPrice: { fontSize: 36, fontWeight: 'bold', color: theme.colors.text },
  planPeriod: { fontSize: 16, color: theme.colors.textSecondary, marginLeft: 4 },
  originalPrice: { fontSize: 16, color: theme.colors.textSecondary, textDecorationLine: 'line-through', marginBottom: 12 },
  planFeatures: { marginBottom: 20 },
  planFeature: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  planFeatureText: { fontSize: 14, color: theme.colors.text, marginLeft: 8 },
  selectButton: { backgroundColor: theme.colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  selectButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  footer: { fontSize: 12, color: theme.colors.textSecondary, textAlign: 'center', paddingHorizontal: 30, lineHeight: 18 },
  activatedContainer: { alignItems: 'center', padding: 30 },
  activatedTitle: { fontSize: 28, fontWeight: 'bold', color: theme.colors.text, marginTop: 20, marginBottom: 8 },
  activatedText: { fontSize: 16, color: theme.colors.textSecondary, marginBottom: 30 },
  featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%', marginBottom: 30 },
  featureCard: { width: '48%', backgroundColor: theme.colors.card, borderRadius: 12, padding: 16, marginBottom: 12, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border },
  featureCardTitle: { fontSize: 12, fontWeight: '600', color: theme.colors.text, marginTop: 8, textAlign: 'center' },
});
