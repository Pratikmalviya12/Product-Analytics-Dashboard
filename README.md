# Product Analytics Dashboard

A real-time analytics dashboard built with React, featuring **Google Analytics 4 (GA4) integration** for real-world data insights, focusing on performance for large datasets (100k+ rows) and accessibility.

## ✨ Features

- **📊 Real-time GA4 Integration**: Connect to your Google Analytics 4 property for live data
- **🎯 Interactive Visualizations**: Area charts, bar charts, device breakdowns with Recharts
- **⚡ High Performance**: Virtualized tables handling 100k+ rows smoothly
- **💾 Data Management**: Save views, export CSV, import custom data
- **🔒 Privacy Compliant**: GDPR-ready with cookie consent and anonymization
- **📱 Responsive Design**: Beautiful glass-morphism UI that works on all devices
- **⚙️ Dual Mode**: Switch between simulated data and real GA4 data

## 🚀 Quick Start

### Basic Setup
```bash
npm install
npm run dev
```

### GA4 Integration Setup
```bash
# Run the interactive GA4 setup helper
npm run setup:ga4

# Or manually create .env.local with your GA4 credentials
cp .env.example .env.local
```

**📖 For complete GA4 setup instructions, see [GA4_SETUP_GUIDE.md](./GA4_SETUP_GUIDE.md)**

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Analytics**: Google Analytics 4 (GA4) with Data API
- **State**: Zustand for client state
- **Data Fetching**: React Query with client-side caching  
- **Charts**: Recharts for visualizations
- **Tables**: TanStack Table with virtualization
- **Styling**: Tailwind CSS with glass-morphism design
- **Mocking**: MSW for development API
- **Testing**: Vitest + Testing Library
- **Build**: Vite

## 📊 GA4 Features

### What's Tracked
- **Page Views**: Dashboard visits and navigation
- **User Interactions**: Button clicks, filter changes, chart interactions
- **Data Operations**: Exports, saved views, data source changes
- **Performance**: Load times and user engagement metrics
- **Custom Events**: Dashboard-specific analytics events

### Privacy & Compliance
- ✅ Cookie consent banner
- ✅ IP anonymization enabled
- ✅ GDPR compliant data handling
- ✅ User opt-out functionality
- ✅ No personal data collection

## 🎯 Performance Features

- Memoized selectors for efficient re-renders
- Virtual scrolling for large datasets
- Code-splitting for chart components
- Client-side caching with React Query

## ♿ Accessibility

- Semantic table markup
- Keyboard navigation for filters
- Screen reader support
- Respects `prefers-reduced-motion`

## 🧪 Testing

```bash
npm test          # Unit tests
npm run test:ui   # Vitest UI
```

## 📊 Data Generation

The app generates synthetic event data with a configurable seed for reproducible datasets. Events include page views, clicks, signups, and purchases across different devices and countries.

## 🎨 Architecture

```
src/
├── lib/           # Types, data generation, utilities
├── state/         # Zustand stores  
├── features/      # Feature-based components
├── ui/            # Shared UI components
├── api/           # MSW handlers
└── test/          # Test utilities
```
