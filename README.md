# Product Analytics Dashboard

A real-time analytics dashboard built with React, focusing on performance for large datasets (100k+ rows) and accessibility.

## ✨ Features

- **M1 (Current)**: Basic data generation + KPI skeleton
- **M2**: Interactive charts (area, bar, pie) with Recharts
- **M3**: Virtualized data tables with TanStack Table
- **M4**: Saved views with shareable URLs
- **M5**: CSV import/export functionality

## 🚀 Getting Started

```bash
npm install
npm run dev
```

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **State**: Zustand for client state
- **Data Fetching**: React Query with client-side caching
- **Charts**: Recharts for visualizations
- **Tables**: TanStack Table with virtualization
- **Mocking**: MSW for development API
- **Testing**: Vitest + Testing Library
- **Build**: Vite

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
