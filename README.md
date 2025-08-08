# D&D Named Encounters Generator

An enhanced D&D encounter generator that creates unique monster names and party motivations, built using React and based on the logic from dnd-encounters-24.

## Features

### ✨ Enhanced Encounter Generation
- **No Theme Restrictions**: Uses all available monsters regardless of campaign theme
- **Four Encounter Types**: 
  - Dragon or Legendary (single powerful creature)
  - Mounts and Riders (mounted combat encounters)
  - Groups (same creature type in numbers)
  - Mixed Groups (leader + minions)

### 🎭 Enhanced Monster Names
- **Cultural Name Generation**: Uses 5 distinct cultural naming systems (Aquilonian, Barbarian, Oriental, Lusitanian, Q'haran)
- **Personal Names**: Generates culturally authentic personal names like "Karim al-Din" or "Lancelot the Ancient"
- **Atmospheric Titles**: Context-aware titles based on monster type (Dragons get "Stormcaller", Fiends get "the Corrupted")
- **Syllable-Based Generation**: Sophisticated name creation using authentic linguistic patterns
- **Monster Type Awareness**: Names reflect creature nature (Noble for Celestials, Dark for Undead)
- **Preserve Original Stats**: Original names preserved for mechanical reference

### 🎯 Party Motivations
- **8 Motivation Categories**: Territorial, Hunger, Treasure, Vengeance, Orders, Curiosity, Madness, Survival
- **Contextual Explanations**: Provides narrative reasons why the party encounters these monsters
- **Story Integration**: Helps DMs weave encounters into the ongoing narrative

### 📊 Clean Table Layout
- **Professional Tables**: Clean, sortable displays instead of text lists
- **Monster Details**: Name, Display Name, Type/Role, CR, and encounter details
- **Mobile Responsive**: Works well on all screen sizes

### 💾 Local Data Persistence
- **Save Encounters**: Keep your favorite encounters for reuse
- **Browser Storage**: Uses localStorage - no server required
- **Export/Import Ready**: Stored as JSON for easy backup

## Installation & Usage

1. **Clone or Download** the project
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Start Development Server**:
   ```bash
   npm start
   ```
4. **Open Browser** to http://localhost:3000

## How to Use

1. **Configure Party**: Set character levels, number of characters, and difficulty
2. **Generate Encounter**: Click "Generate Named Encounter" 
3. **Review Results**: See the encounter table with unique names and motivation
4. **Save Favorites**: Save encounters you want to reuse
5. **Manage Library**: View, delete, or clear all saved encounters

## Technology Stack

- **React 18** - Modern UI framework
- **JavaScript ES6+** - Core logic and data processing
- **CSS3** - Responsive styling with D&D theme
- **localStorage** - Browser-based data persistence

## Data Sources

All creature data is based on official D&D 5e sources, organized by:
- **Challenge Ratings**: 1/8 to 30
- **Monster Types**: Dragons, Legendary creatures, Mounts, Riders, Standard monsters
- **XP Calculations**: Official encounter building guidelines

## Key Improvements Over Original

1. **Removed Theme Restrictions**: All creatures available regardless of campaign arc
2. **Added Name Generation**: Unique, atmospheric names for every monster
3. **Added Story Context**: Motivations explain why encounters happen
4. **Improved UI**: Clean tables instead of text lists
5. **Data Persistence**: Save and manage encounter library
6. **Better UX**: Responsive design, clear information hierarchy

## Azure Static Web Apps Deployment

This app is designed for Azure Static Web Apps:
- **No Server Required**: Pure client-side React application
- **Automatic Deployment**: Configure GitHub Actions for CI/CD
- **Free Hosting**: Perfect for the Azure Static Web Apps free tier

For database needs beyond localStorage, consider:
- **Azure Cosmos DB** - For multi-user encounter sharing
- **Azure Functions** - For server-side encounter generation APIs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational and personal use. D&D 5e content is property of Wizards of the Coast.

---

## Available Scripts (Create React App)

### `npm start`
Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`
Launches the test runner in the interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder. Your app is ready to be deployed!
