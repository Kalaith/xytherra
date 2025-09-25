# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains **Xytherra**, a 4X grand strategy game design with an interactive React frontend for exploring the game mechanics. The core concept is that planets serve as the tech tree, with each planet type representing a technology domain that shapes empire development.

## Development Commands

### Frontend (React/Vite)
```bash
cd xytherra-design-doc
npm install          # Install dependencies
npm run dev         # Start development server (usually localhost:5174)
npm run build       # Build for production
npm run preview     # Preview production build
```

## Project Structure

```
xytherra/
├── readme.md                    # Original game design document
├── CLAUDE.md                   # This file
└── xytherra-design-doc/        # Interactive React frontend
    ├── src/
    │   ├── components/
    │   │   └── Navigation.tsx   # Main navigation component
    │   ├── pages/
    │   │   ├── HomePage.tsx     # Landing page with core concept
    │   │   ├── PlanetTypesPage.tsx    # Interactive planet type explorer
    │   │   ├── TechTreePage.tsx       # Tech trajectory visualizations
    │   │   ├── FactionsPage.tsx       # Faction showcase (WIP)
    │   │   ├── VictoryPage.tsx        # Victory conditions (WIP)
    │   │   └── GameplayPage.tsx       # Sample gameplay walkthrough (WIP)
    │   ├── App.tsx             # Main app with routing
    │   └── index.css           # Tailwind CSS imports
    ├── tailwind.config.js      # Custom color scheme and animations
    ├── vite.config.ts          # Vite + Tailwind configuration
    └── package.json            # Dependencies and scripts
```

## Technology Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** with custom space-themed colors
- **Framer Motion** for animations and transitions
- **React Router** for navigation
- **Recharts** for data visualizations (radar charts, bar charts)
- **Lucide React** for icons

## Game Design Architecture

### Core Systems
- **Planet-Tech Trajectory System**: Colonization order determines technological DNA
- **Planet Types**: 7 unique domains (Water=Shields, Volcanic=Weapons, Rocky=Industry, Gas=Propulsion, Ice=Sensors, Living=Biotech, Desolate=Survival)
- **Hybrid Technologies**: Unlock through multi-planet control with research tier requirements
- **Weighting System**: Early colonies (×3, ×2, ×1.5) have more impact than later ones

### Interactive Features Implemented
- **Planet Explorer**: Click planets to see detailed tech trees and research tiers
- **Trajectory Visualizer**: Compare different colonization paths with radar charts
- **Animated Timeline**: Watch how colonization order affects final tech weights
- **Hybrid Tech Showcase**: Visual representation of cross-domain technologies

## Key Design Principles

- **Order Matters**: Colonization sequence creates permanent empire identity
- **No Linear Tech Trees**: All advancement through planetary mastery
- **Strategic Trade-offs**: Speed vs. specialization in colonization choices
- **Unique Replayability**: Procedural galaxies ensure different tech options each game

## Development Guidelines

### Styling
- Use custom Tailwind color palette (space-*, volcanic-*, water-*, etc.)
- Maintain dark space theme with gradient backgrounds
- Leverage Framer Motion for smooth page transitions and hover effects
- Ensure responsive design across desktop and mobile

### Component Patterns
- Use TypeScript interfaces for all data structures
- Implement loading states and animations for better UX  
- Follow existing icon usage patterns (Lucide React icons)
- Maintain consistent spacing and typography scales

### Future Development
- Complete remaining pages (Factions, Victory, Gameplay)
- Add interactive empire builder simulation
- Implement save/load functionality for colonization experiments
- Consider adding sound effects and ambient space audio