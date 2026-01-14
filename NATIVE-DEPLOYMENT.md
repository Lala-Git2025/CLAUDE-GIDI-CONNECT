# 📱 Gidi Vibe Connect - Native Mobile Deployment Guide

Your app is now ready for iOS and Android deployment using Capacitor!

## ✅ What's Done

- ✅ Capacitor installed and configured
- ✅ iOS project created (`/ios`)
- ✅ Android project created (`/android`)
- ✅ Web assets synced to both platforms
- ✅ All updates preserved (including exponential backoff in news agent)

## 📱 Deploy to iOS

### Requirements
- macOS computer
- Xcode installed (from App Store)
- Apple Developer Account ($99/year)

### Steps

1. **Open iOS Project**
   ```bash
   npx cap open ios
   ```

2. **In Xcode:**
   - Select your development team in Signing & Capabilities
   - Choose a device or simulator
   - Click Run (▶️) to test
   - For App Store: Product → Archive

### App Store Submission
- [Apple Developer Portal](https://developer.apple.com)
- Create App ID: `com.gidivibe.connect`
- Upload build through Xcode

## 🤖 Deploy to Android

### Requirements
- Android Studio installed
- Google Play Console account ($25 one-time)

### Steps

1. **Open Android Project**
   ```bash
   npx cap open android
   ```

2. **In Android Studio:**
   - Let Gradle sync complete
   - Select device/emulator
   - Click Run (▶️) to test
   - For Play Store: Build → Generate Signed Bundle

### Play Store Submission
- [Google Play Console](https://play.google.com/console)
- Create app with package name: `com.gidivibe.connect`
- Upload AAB file

## 🔄 Making Updates

After changing your web code:

```bash
# 1. Build web app
npm run build

# 2. Sync to native platforms
npx cap sync

# 3. Open in Xcode/Android Studio
npx cap open ios
npx cap open android
```

## 📦 Key Files

- `capacitor.config.ts` - Main Capacitor configuration
- `/ios` - iOS native project (don't git commit)
- `/android` - Android native project (don't git commit)
- `/dist` - Built web assets

## 🎨 App Icons & Splash Screens

### Generate Assets

1. Create 1024x1024 app icon
2. Use [Capacitor Asset Generator](https://github.com/capacitor-community/assets):
   ```bash
   npm install -g @capacitor/assets
   npx capacitor-assets generate
   ```

3. Place icons in:
   - `/resources/icon.png` (1024x1024)
   - `/resources/splash.png` (2732x2732)

## 🔧 Troubleshooting

### iOS Build Errors
- Clean build: Product → Clean Build Folder
- Update CocoaPods: `cd ios && pod install`
- Check signing certificates

### Android Build Errors
- Invalidate caches: File → Invalidate Caches / Restart
- Sync Gradle: File → Sync Project with Gradle Files
- Check SDK versions in `build.gradle`

## 📱 Testing on Physical Devices

### iOS
1. Connect iPhone via USB
2. Trust computer on device
3. Select device in Xcode
4. Run

### Android
1. Enable Developer Mode on device
2. Enable USB Debugging
3. Connect via USB
4. Select device in Android Studio
5. Run

## 🚀 App Features

Your native app includes:
- ✅ All web functionality
- ✅ Native status bar styling
- ✅ Haptic feedback
- ✅ Keyboard handling
- ✅ Native back button (Android)
- ✅ Offline PWA capabilities
- ✅ Push notifications ready

## 📰 AI News Agent

The exponential backoff is preserved in `/scripts/lagos-news-agent.js`:
- Handles Gemini API rate limits automatically
- Retries: 2s → 4s → 8s → 16s → 32s
- Falls back to simulated news if all retries fail
- Runs via GitHub Actions every 3 hours

## 🔗 Resources

- [Capacitor Docs](https://capacitorjs.com/docs)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios)
- [Android Design Guidelines](https://developer.android.com/design)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Google Play Console](https://play.google.com/console)

## 💡 Next Steps

1. **Test on devices** - Install on your iPhone/Android
2. **Generate app icons** - Create branded assets
3. **Configure app metadata** - Update names, descriptions
4. **Submit for review** - Upload to stores
5. **Monitor analytics** - Track usage and crashes

---

Built with ❤️ for Lagos | Powered by Capacitor + React + Vite
