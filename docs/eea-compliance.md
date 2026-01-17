# EEA Compliance Statement
## Splits Fitness & Nutrition

**Last Updated**: January 17, 2026

This document outlines compliance with European Economic Area (EEA) regulations, including GDPR, for the Splits Fitness & Nutrition mobile application.

## Data Collection Statement

**This application collects ZERO personal data.**

### What We DON'T Collect
- ❌ No personal information (name, email, phone)
- ❌ No location data
- ❌ No device identifiers
- ❌ No usage analytics
- ❌ No advertising IDs
- ❌ No cookies or tracking pixels
- ❌ No cloud storage or backups
- ❌ No third-party data sharing

### Local Storage Only
All workout, nutrition, and progress data is stored **exclusively on the user's device** using:
- React Native AsyncStorage (local device storage)
- No server communication
- No cloud synchronization
- Data deleted when app is uninstalled

### GDPR Compliance

#### Article 6 (Lawful Basis)
Not applicable - no personal data is processed.

#### Article 7 (Consent)
Not applicable - no data collection requires consent.

#### Article 9 (Special Categories)
Although fitness and health data could be considered special categories, this app:
- Stores all data locally on the device
- Never transmits data to external servers
- Does not process data in the GDPR sense

#### Article 13 & 14 (Information to Data Subjects)
No information collected, stored remotely, or processed by the controller.

#### Article 15-22 (Data Subject Rights)
Users have complete control:
- **Right to Access**: Data never leaves their device
- **Right to Rectification**: Users can edit all entries
- **Right to Erasure**: Uninstall app or clear data in settings
- **Right to Data Portability**: Export feature available in-app
- **Right to Object**: No processing to object to

### Third-Party Services

#### Expo Framework
- Used for app development and building
- No data collection by Expo in production builds
- Analytics disabled in app.json

#### Google Play Store
- App distribution only
- Payment processing for premium features
- Google's privacy policy applies for purchases only

#### Expo Notifications (Local Only)
- Rest timer notifications are **local device notifications**
- No push notification servers
- No FCM (Firebase Cloud Messaging)
- No notification tracking

### Children's Privacy (COPPA)
- App does not target children under 13
- No age verification required (no accounts)
- Safe for all ages due to zero data collection

### International Data Transfers
Not applicable - no data transferred internationally or domestically.

### Data Retention
- Data persists locally while app is installed
- Users can clear data via Settings screen
- Complete removal via app uninstallation

### Security Measures
- AsyncStorage uses device-level encryption (iOS/Android default)
- No server-side vulnerabilities (no server)
- No network attack surface (no API calls)

### Changes to Privacy Practices
Any changes to data collection would require:
1. App update with clear changelog
2. Updated privacy policy
3. User notification via update notes

### Contact Information
For privacy inquiries:
- Email: privacy@splitsfitness.app
- GitHub: https://github.com/josegilleite-cyber/Splits-Fitness-Nutrition

### Legal Entity
[Update with your legal entity information when ready]
- Company Name: TBD
- Registration Number: TBD
- Address: TBD

## Google Play Data Safety Form Answers

### Does your app collect or share any of the required user data types?
**Answer**: No

### Data Safety Section Display
**What users will see**:
> "No data collected"
> 
> "The developer says this app doesn't collect or share any user data"

### Specific Category Responses

#### Personal Information
Collected: No
Shared: No

#### Financial Information
Collected: No
Shared: No
*(Note: Google Play handles payments, not the app)*

#### Location
Collected: No
Shared: No

#### Health & Fitness
Collected: No*
Shared: No

*While users enter fitness data, it is stored locally and never collected by the developer.

#### Messages
Collected: No
Shared: No

#### Photos & Videos
Collected: No
Shared: No

#### Audio Files
Collected: No
Shared: No

#### Files & Docs
Collected: No
Shared: No

#### Calendar
Collected: No
Shared: No

#### Contacts
Collected: No
Shared: No

#### App Activity
Collected: No
Shared: No

#### Web Browsing
Collected: No
Shared: No

#### App Info & Performance
Collected: No
Shared: No

#### Device or Other IDs
Collected: No
Shared: No

### Security Practices

#### Data Encryption
In transit: Not applicable (no data transmission)
At rest: Yes (device-level encryption via iOS/Android)

#### User Controls
Users can request data deletion: Yes (via in-app settings or uninstall)

#### Independent Security Review
Status: Not yet conducted
Planned: Optional for future versions

## EEA-Specific Commitments

1. **Data Localization**: All data remains on EEA users' devices
2. **No US Cloud Services**: No AWS, Google Cloud, or Azure data storage
3. **Local Processing**: All calculations performed on-device
4. **Transparency**: Open-source documentation available
5. **User Control**: Complete data ownership by users

## Compliance Verification

This app complies with:
- ✅ GDPR (EU General Data Protection Regulation)
- ✅ ePrivacy Directive
- ✅ COPPA (Children's Online Privacy Protection Act)
- ✅ CCPA (California Consumer Privacy Act) - by not collecting data
- ✅ Google Play Developer Policies
- ✅ Apple App Store Review Guidelines

## Declaration

I, the developer of Splits Fitness & Nutrition, declare that:

1. This app does not collect, store remotely, or share any personal data
2. All data remains on the user's device using local storage only
3. No third-party analytics or tracking services are integrated
4. Premium purchases are processed by Google Play/Apple (their policies apply)
5. The app functions entirely offline and requires no internet connection
6. Users maintain complete control and ownership of their data

**Signed**: [Developer Name]  
**Date**: January 17, 2026  
**Version**: 1.0.0
