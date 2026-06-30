# Wobb Frontend Assignment - Solution Summary

This repository contains a fully refactored, optimized, and redesigned influencer search application built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Zustand**. 

---

## 🚀 Key Improvements

### 1. State Management (Zustand Integration)
- Replaced the state stubs with a centralized Zustand store (`src/store/influencerStore.ts`).
- Created campaign/list management actions (create, delete list, add/remove creators).
- Integrated Zustand's `persist` middleware to ensure all custom campaign lists and the active list selection persist automatically in `localStorage` across page reloads.

### 2. Core Bug Fixes
- **Case-Insensitive Search**: Fixed the case-sensitive username search bug in `src/utils/dataHelpers.ts`. Searching for `CRISTIANO` or `cristiano` now successfully resolves.
- **Statistic Calculations & Labels**: Corrected statistics displayed on the detail profile page (`src/pages/ProfileDetailPage.tsx`):
  - Fixed the **Engagements** box to display the total engagements count (e.g. `7.54M` for Cristiano) using `formatFollowersDetail` rather than calling the engagement rate formatter.
  - Fixed the **Engagement Rate** box to display the formatted engagement rate percentage correctly (e.g. `1.26%` for Cristiano) rather than performing artificial multiplication (`* 10000`).
- **Unused Files**: Removed duplicate unused search input component (`src/components/SearchBar.tsx`).

### 3. Modern UI/UX Redesign
- **Fluid Layout**: Upgraded `src/index.css` to remove rigid layout widths and implemented a fully responsive screen design.
- **Glassmorphic Theme**: Designed card structures, overlays, headers, and inputs using light/dark responsive CSS variables, soft blurs (`backdrop-blur`), and shadows.
- **Campaign Sidebar Manager**: Created a dedicated `ListManager` sidebar component for managing campaigns:
  - Add new campaigns/lists.
  - Display counts of creators in each campaign.
  - Swiftly review added creators (avatars + names) with one-click removal.
  - Delete empty or obsolete lists (with confirmation alerts).
- **Interactive Discover Cards**: Re-engineered `ProfileCard.tsx` with platform-specific badges and tags. Built an absolute popover dropdown for the **Add to List** button to add the influencer to any list while preventing duplicate entries.
- **Polished Profile Details**: Redesigned `ProfileDetailPage.tsx` with statistical cards, custom indicators/icons (`lucide-react`), platform-themed badges, and quick campaign-list selectors.

---

## 📦 Libraries Added
- **Zustand** (`^5.0.0` / legacy compatible): For lightweight and scalable global state management.
- **Lucide React** (`^0.400.0`): For rich, consistent modern iconography.

---

## 🔮 Assumptions Made
1. **Source Platform Context**: Since influencer profiles in lists need to navigate back to their respective profile detail page with their source platform, we added an optional `platform` field to the `UserProfileSummary` type to preserve platform context within campaign lists.
2. **Platform Redirection**: Opening creator details via campaign list cards automatically references the platform they were discovered on.

---

## ⚖️ Trade-offs
- **Custom Inline SVG Icons**: In `PlatformFilter.tsx`, we used custom inline SVGs for the Instagram, YouTube, and TikTok logos rather than importing from `lucide-react`. This avoids dependency packaging anomalies and guarantees exact brand logos across standard build configurations.

---

## 🛠️ Remaining Improvements / Future Steps
1. **Drag-and-Drop Reordering**: Although `react-beautiful-dnd` is in the dependencies, it is deprecated and conflicts with React 19 peer resolutions. A future enhancement could use `@dnd-kit/core` to enable drag-and-drop sorting of creators within lists.
2. **Search Debouncing**: Implement search debouncing on the query input to prevent heavy filter runs during rapid keystrokes (though dataset size is currently small).
3. **Unit and Component Tests**: Add test suites using Vitest and React Testing Library to verify state actions and component renders.

---

## 🏃‍♂️ Getting Started

### Install Dependencies
```bash
npm install --legacy-peer-deps
```
*(Note: `--legacy-peer-deps` is recommended due to the peer dependency requirements of deprecated libraries in the starter project package.json)*

### Start Development Server
```bash
npm run dev
```

### Production Build & Linting
```bash
npm run lint
npm run build
```
