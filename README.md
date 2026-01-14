# 🌟 Gidi Connect - Lagos Lifestyle & Social Discovery Platform

Your ultimate guide to experiencing Lagos nightlife, events, dining, and social connections.

---

## 📱 Project Overview

Gidi Connect is a multi-platform application (Web + Mobile) that helps users discover, explore, and connect with Lagos's vibrant lifestyle scene. Built with modern web technologies and React Native for native mobile experiences.

---

## 🏗️ Project Structure

```
gidi-vibe-connect-1/
├── apps/
│   ├── consumer-app/          # React Native mobile app (iOS/Android)
│   ├── mobile-app/            # Secondary mobile app instance
│   ├── admin-portal/          # Admin dashboard
│   └── business-portal/       # Business management portal
├── src/                       # Main web application (React + Vite)
│   ├── components/            # Reusable UI components
│   ├── pages/                 # Web app pages/routes
│   └── integrations/          # Third-party integrations
├── scripts/
│   └── lagos-news-agent.js    # AI-powered news scraper
├── ios/                       # iOS native project (Capacitor)
├── android/                   # Android native project (Capacitor)
└── docs/                      # Documentation
```

---

## 🚀 Applications

### 1. Consumer Mobile App (React Native)
**Location**: `apps/consumer-app/`
**Platform**: iOS & Android
**Technology**: React Native + Expo

**Features**:
- 🏠 Home feed with real-time Lagos news
- 🔍 Venue exploration by category & area
- 📅 Events calendar & booking
- 💬 Social communities & interactions
- 👤 User profiles & preferences
- 📰 Live news from 9 Nigerian sources
- 🚦 Real-time traffic updates
- 🎯 Venue vibe check
- 🔥 Trending venues

📖 **[Complete Feature Documentation](CONSUMER-APP-FEATURES.md)**

### 2. Web Application
**Location**: `src/`
**Platform**: Web (PWA)
**Technology**: React + Vite + TypeScript

**Features**:
- Responsive design (mobile-first)
- Progressive Web App capabilities
- Offline support
- All consumer-app features adapted for web

### 3. Admin Portal
**Location**: `apps/admin-portal/`
**Purpose**: Platform management & moderation

### 4. Business Portal
**Location**: `apps/business-portal/`
**Purpose**: Venue owner dashboard & analytics

---

## 🛠️ Technologies

### Frontend
- **React** 19.1.0
- **React Native** 0.81.5
- **TypeScript** 5.9.2
- **Vite** (build tool)
- **Expo** ~54.0.30
- **React Navigation** 7.1.26
- **Tailwind CSS** (web)
- **shadcn/ui** (web components)

### Backend & Infrastructure
- **Supabase** (Database + Auth + Storage)
- **Capacitor** (Native mobile features)
- **AI/ML**: Google Gemini API (news generation)
- **Automation**: macOS launchd (news auto-update)

### Navigation
- **Web**: React Router
- **Mobile**: React Navigation (Custom Bottom Tabs)

---

## 🌐 Key Features

### 📰 AI-Powered News System
- **Real-time scraping** from 9 Nigerian news sources:
  - Premium Times, Punch, BellaNaija, Pulse Nigeria, Legit.ng
  - NotJustOk, Information Nigeria, Vanguard, The Cable
- **Auto-updates** every 3 hours (24/7)
- **Real images** extracted via Open Graph tags
- **Real publish dates** from article metadata
- **Date validation**: Only articles from last 60 days
- **Duplicate prevention**: URL tracking
- **Categories**: General news, events, nightlife, entertainment

📖 **[News System Documentation](NEWS-AUTO-UPDATE.md)**

### 🗺️ Venue Discovery
- Browse by category (restaurants, bars, nightlife, etc.)
- Explore by area (Victoria Island, Lekki, Ikeja, etc.)
- Real-time crowd levels & vibe check
- Trending venues with ratings
- Professional venue images

### 📅 Events & Experiences
- Upcoming events calendar
- Event details & ticketing
- RSVP functionality
- Category filtering

### 💬 Social Features
- Community groups by interest
- User posts & interactions
- Follow system
- Like, comment, share

### 🚦 Live Updates
- Real-time traffic alerts
- Venue atmosphere metrics
- Crowd levels
- Wait time estimates

---

## 🎨 Design System

### Color Palette
- **Primary**: Golden Yellow (#EAB308)
- **Background**: Pure Black (#000)
- **Surface**: Dark Gray (#18181b)
- **Text**: White, Light Gray, Medium Gray
- **Borders**: Darker Gray (#27272a)
- **Accent**: Green (#10B981) for live indicators

### Typography
- **Headers**: 18-24px, bold, golden yellow
- **Body**: 12-14px, normal, white/gray
- **Uppercase**: Section titles and navigation

### Spacing
- Container: 16px padding
- Card padding: 10-16px
- Section margins: 32px
- Border radius: 8-16px

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ & npm
- iOS: macOS + Xcode (for iOS development)
- Android: Android Studio (for Android development)
- Expo CLI (for React Native)

### Web Application
```bash
# Clone repository
git clone https://github.com/yourusername/gidi-vibe-connect-1.git
cd gidi-vibe-connect-1

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
npm run preview
```

### Consumer Mobile App
```bash
# Navigate to consumer app
cd apps/consumer-app

# Install dependencies
npm install

# Start Expo dev server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

### Environment Variables
Create `.env` file in project root:
```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google Gemini API (for news generation)
GEMINI_API_KEY=your_gemini_api_key
```

---

## 🔧 Development Commands

### Web App
```bash
npm run dev                 # Start dev server
npm run build               # Build for production
npm run preview             # Preview production build
npm run lint                # Run ESLint
```

### Mobile App
```bash
npm start                   # Start Expo dev server
npm run ios                 # Run on iOS
npm run android             # Run on Android
npm run web                 # Run in web browser
```

### News System
```bash
npm run news-agent          # Run news scraper manually
npm run news-auto:status    # Check auto-update status
npm run news-auto:logs      # View live logs
npm run news-auto:install   # Install auto-update (macOS)
npm run news-auto:uninstall # Uninstall auto-update
```

---

## 📱 Native Deployment

### iOS Deployment
1. Open iOS project: `npx cap open ios`
2. Configure signing in Xcode
3. Select device/simulator
4. Build & run (▶️ button)
5. For App Store: Product → Archive

### Android Deployment
1. Open Android project: `npx cap open android`
2. Let Gradle sync complete
3. Select device/emulator
4. Build & run (▶️ button)
5. For Play Store: Build → Generate Signed Bundle

📖 **[Native Deployment Guide](NATIVE-DEPLOYMENT.md)**

---

## 📚 Documentation

- **[Consumer App Features](CONSUMER-APP-FEATURES.md)** - Complete feature documentation
- **[News Auto-Update System](NEWS-AUTO-UPDATE.md)** - News scraper & automation
- **[Native Deployment](NATIVE-DEPLOYMENT.md)** - iOS & Android deployment guide
- **[Mobile Optimization](MOBILE_OPTIMIZATION_GUIDE.md)** - PWA & mobile best practices
- **[Xcode Build Updates](XCODE-BUILD-UPDATES.md)** - iOS-specific build notes

---

## 🗄️ Database Schema

### Supabase Tables

#### news
- `id` (uuid) - Primary key
- `title` (text) - Article title
- `summary` (text) - Article description
- `category` (text) - general, events, nightlife
- `publish_date` (timestamp) - Article publish date
- `featured_image_url` (text) - Article image URL
- `external_url` (text) - Original article link
- `is_active` (boolean) - Active status
- `source` (text) - "AI Agent"
- `created_at` (timestamp) - Creation timestamp

#### venues
- `id` (uuid) - Primary key
- `name` (text) - Venue name
- `location` (text) - Venue address/area
- `rating` (numeric) - Rating (0-5)
- `professional_media_urls` (text[]) - Venue images

---

## 🎯 Current Status

### ✅ Completed Features
- [x] Consumer mobile app (React Native)
- [x] Web application (React + Vite)
- [x] Real news scraping from 9 sources
- [x] Auto-update system (every 3 hours)
- [x] Custom navigation with tab bar
- [x] Real-time traffic updates
- [x] Venue discovery & exploration
- [x] Events calendar
- [x] Social communities
- [x] User profiles
- [x] Pull-to-refresh
- [x] Image lazy loading
- [x] Date validation for news
- [x] Duplicate prevention
- [x] iOS & Android native projects
- [x] Logo removal & text-based headers
- [x] Card size optimization

### 🚧 In Progress
- [ ] User authentication system
- [ ] Push notifications
- [ ] Favorites & bookmarks
- [ ] Event booking system
- [ ] User reviews & ratings

### 📋 Planned Features
- [ ] Social sharing
- [ ] Photo uploads
- [ ] Chat/messaging
- [ ] Payment integration
- [ ] Analytics dashboard
- [ ] Admin moderation tools
- [ ] Business portal features

---

## 🏆 Recent Updates

### January 2026
- ✅ Created comprehensive consumer-app documentation
- ✅ Logo removed from all screens (text-based design)
- ✅ Custom tab bar implementation (fixed spacing issues)
- ✅ Card size optimization (news: 260x100px, venues: 150x80px)
- ✅ Replicated features to mobile-app and web app
- ✅ Verified all components and screens

### December 2025
- ✅ Implemented real news scraping (9 sources)
- ✅ Added date validation (60-day window)
- ✅ Added duplicate prevention
- ✅ Added entertainment news sources
- ✅ Auto-update system installed (macOS launchd)
- ✅ Logging system for news agent

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 👥 Team

**Gidi Connect Development Team**
- Product Design
- Frontend Development
- Backend Development
- Mobile Development
- QA & Testing

---

## 📞 Support

For questions, issues, or feature requests:
- **Documentation**: See docs in this repository
- **Issues**: GitHub Issues
- **Email**: support@gidiconnect.com

---

## 🔗 Resources

### Official Links
- **Web App**: [https://gidiconnect.com](https://gidiconnect.com)
- **Project URL**: https://lovable.dev/projects/d5e140f4-4717-4812-b448-e72fc18e063e

### Technologies
- [React Documentation](https://react.dev)
- [React Native Documentation](https://reactnative.dev)
- [Expo Documentation](https://docs.expo.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)

---

**Built with ❤️ for Lagos | Powered by React, React Native, and Supabase**

**Last Updated**: January 9, 2026 | **Version**: 1.0.0
