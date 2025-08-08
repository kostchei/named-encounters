# Development Documentation

This document contains development notes, technical details, and future plans for the D&D Named Encounters Generator.

## Recent Development History

### Enhanced Naming System Implementation

#### Group Naming Consistency (75% / 25% Rule)
- **75% of encounters**: All monsters use the same naming style for thematic consistency
- **25% of encounters**: Mixed naming with exactly 2 styles, alternating for variety
- Prevents monotonous all-atmospheric or all-cultural naming
- Creates more immersive, culturally cohesive encounters

#### Cultural Name Generators
- **Aquilonian**: Arthurian/Medieval (Lancelot, Gawain, Repanse)
- **Barbarian**: Nordic/Germanic (Thorek, Grimvar, Higurvald) 
- **Oriental**: Japanese/Chinese (Kenji, Ming-Wei, Akane)
- **Lusitanian**: Portuguese/Venetian (Ricardo, Elena, António)
- **Q'haran**: Arabic/Persian (Hassan, Amira, Malik al-Din)

Each generator combines:
- Predefined authentic names (50% chance)
- Syllable-based generation (50% chance)
- Atmospheric titles based on monster type

#### Recent Fixes
1. **Q'haran Name Length Issue**: Fixed overly short names by always including middle syllables
2. **UI Layout Issues**: Improved party configuration with CSS Grid for better label-dropdown association

### Mount and Rider System Enhancement

#### Problems Fixed
- **Single Creature Issue**: Now guarantees minimum 2 creatures
- **XP Waste**: Efficiently uses leftover XP for additional creatures
- **Poor Variety**: Balances mount+rider pairs (70%) with dismounted riders (30%)

#### Implementation Logic
1. **Target Quantity**: `Math.max(2, randomQuantity)` - always 2+ creatures
2. **Pair Creation**: Attempts mount+rider combinations within budget
3. **Fill with Dismounted**: Adds individual riders to reach target
4. **XP Optimization**: Uses remaining budget for more creatures (up to max)

### Tarot Motivation System

#### Focused Context Approach
Each encounter gets ONE focused tarot reading with:
- **Card Name + Orientation** (Upright/Reversed)
- **Single Context**: One of four interpretations:
  - **Creature Motivation**: Why monsters behave this way
  - **Situation**: Circumstances driving the encounter
  - **Place**: Environmental context and atmosphere  
  - **Treasure Context**: What treasures mean here

This provides **352 possible combinations** (44 cards × 2 orientations × 4 contexts) while keeping each encounter focused.

## Technical Architecture

### Core System Components

#### encounterSystem.js
- **Main Generation Logic**: Four encounter types (Dragon/Legendary, Mounts/Riders, Groups, Mixed)
- **XP Budget Management**: Efficient allocation within party XP limits
- **Group Naming Integration**: Applies consistent or mixed naming styles
- **Terrain/Distance**: Generates appropriate encounter distances by terrain type

#### Name Generators
- **monsterNameGenerator.js**: Central naming coordinator
- **Cultural Generators**: Five distinct cultural naming systems
- **Atmospheric System**: Context-aware prefixes/suffixes by monster type
- **Style Forcing**: `generateMonsterNameWithStyle()` for group consistency

#### Data Management
- **JSON Data Sources**: CR tables, monster lists, tarot cards, motivations
- **localStorage Integration**: Persistent encounter library
- **React State Management**: Real-time UI updates

### UI/UX Implementation

#### Responsive Design
- **CSS Grid Layout**: Professional two-column layout (generator + encounters)
- **Mobile Responsive**: Single-column stack on smaller screens
- **Encounter Cards**: Clean card-based display with detailed tables

#### Party Configuration
- **Grid System**: Fixed label-dropdown association issues
- **Visual Containers**: Clear separation between party members
- **Real-time XP**: Dynamic budget calculation

## Future Development Plans

### Immediate Priorities

#### 1. Testing and Quality Assurance
- [ ] Automated tests for name generator consistency
- [ ] XP budget allocation edge case testing
- [ ] Mobile UI testing across devices
- [ ] Performance optimization for large encounter libraries

#### 2. User Experience Enhancements
- [ ] Encounter search and filtering in saved library
- [ ] Bulk encounter generation for session prep
- [ ] Export encounters to PDF or text format
- [ ] Encounter templates and presets

### Medium-Term Features

#### 3. Enhanced Naming System
- [ ] Custom naming style creation tools
- [ ] Name pronunciation guides
- [ ] Cultural name meaning tooltips
- [ ] Player-character naming integration

#### 4. Advanced Encounter Features
- [ ] Environmental hazard integration
- [ ] Multi-stage encounter sequences
- [ ] NPC relationship webs between encounters
- [ ] Seasonal/temporal encounter variations

#### 5. Campaign Integration
- [ ] Campaign-specific encounter libraries
- [ ] Recurring NPC tracking across encounters
- [ ] Story arc encounter linking
- [ ] Player action consequence encounters

### Long-Term Vision

#### 6. Multiplayer and Sharing
- [ ] DM encounter sharing community
- [ ] Collaborative encounter building
- [ ] Rating and review system for encounters
- [ ] Import/export from popular VTT platforms

#### 7. AI Enhancement
- [ ] AI-generated encounter descriptions
- [ ] Dynamic encounter adaptation based on party actions
- [ ] Procedural dungeon encounter chains
- [ ] Natural language encounter queries

#### 8. Platform Expansion
- [ ] Progressive Web App (PWA) capabilities
- [ ] Desktop electron app
- [ ] Mobile native apps
- [ ] VTT plugin development

## Technical Debt and Refactoring

### Code Organization
- [ ] Split large components into smaller, focused components
- [ ] Create custom hooks for encounter management
- [ ] Implement proper TypeScript conversion
- [ ] Add comprehensive error handling

### Performance Optimization
- [ ] Implement virtual scrolling for large encounter lists
- [ ] Lazy load encounter data
- [ ] Optimize name generation algorithms
- [ ] Cache frequently used encounter types

### Accessibility
- [ ] Screen reader optimization
- [ ] Keyboard navigation improvements
- [ ] High contrast mode support
- [ ] Font size scaling options

## Contributing Guidelines

### Development Setup
1. Clone repository
2. Run `npm install`
3. Start with `npm start`
4. Build with `npm run build`

### Code Standards
- Follow existing naming conventions
- Write comprehensive comments for complex logic
- Test new features thoroughly
- Maintain responsive design principles

### Pull Request Process
1. Create feature branch from master
2. Implement changes with tests
3. Update documentation as needed
4. Submit PR with detailed description
5. Address review feedback promptly

## Deployment Strategy

### Azure Static Web Apps
- **Current**: Manual build and deploy
- **Target**: Automated CI/CD pipeline
- **Features**: Automatic staging environments for PRs
- **Monitoring**: Application Insights integration

### Alternative Platforms
- **Netlify**: Alternative with similar features
- **Vercel**: Optimized for React applications
- **GitHub Pages**: Simple static hosting option

---

*Last Updated: January 2025*
*Development continues...*