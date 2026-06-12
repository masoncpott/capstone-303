# Project Brief: Smart Panel Energy Management App

## Project Overview
This project is a mobile-first web application that demonstrates circuit-level home energy monitoring, time-of-use pricing context, and analytics-driven insights. The app emphasizes quick, glanceable household energy awareness and drill-down views for individual circuits.

The product story:

> Homeowners can reduce electricity costs by understanding which circuits consume the most power and when rates are most expensive.

## Application Notes


### High-Level UX Notes:
- Home dashboard with current usage and current pricing context.
- Circuit list/grid with per-circuit status, draw, and relative contribution.
- Circuit detail route with usage analytics and cost estimates.
- Analytics panel with timeframe switching and multiple chart types.
- Mobile-oriented shell with top navigation and fixed bottom navigation.

### Pages and Navigation
- `/` Home dashboard
- `/circuits` All circuits
- `/circuits/:circuitId` Circuit detail
- `/about` Product/about content

Routing must be client-side using React Router.

## Technology Stack

### Frontend
- Vite
- React 19 + TypeScript
- Material UI (MUI) + Emotion
- React Router DOM
- Chart.js + react-chartjs-2

### Data and Configuration
- Local static JSON files loaded directly in the client:
  - `src/data/mockData.json`
  - `src/data/powerAnalyticsConfig.json`
- Utility helpers for chart timeframe filtering and series construction.


## Architecture Notes

### App Structure
- Create a shared app shell with top nav, page container spacing, and fixed bottom nav.
- Route-based page composition in `App.tsx`.
- Reusable home and chart components under `src/components/home`.
- Circuit-specific component library under `src/components/circuit`.

### Dashboard Analytics
- Timeframe filtering supports `1d`, `1w`, `1m`, `3m`.
- Line, bar, and doughnut charts are rendered with reusable wrappers.

## Mobile-First Requirements
The application much be a mobile-friend web application.
- Use a card-based layout and stacked sections on narrow screens.
- Touch-friendly bottom navigation.
- High-priority metrics surfaced near the top.
- Compact chart controls with timeframe toggles.

## Scripts
- `npm run dev` starts Vite dev server.
- `npm run build` creates production build output.
- `npm run preview` serves the built output locally.

## Success Criteria
This version is successful if:
- Users can quickly understand household usage and current pricing context.
- Users can identify top-consuming circuits and trends by timeframe.
- The app remains cleanly componentized and easy to extend.
- The stack and architecture are transparently represented as frontend-only with local mocked data.
