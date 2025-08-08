// monsterNameGenerator.js
// Enhanced monster naming system using cultural name generators + atmospheric modifiers

import aquilonianNames from './aquilonianNames.js';
import barbarianNames from './barbarianNames.js';
import orientalNames from './orientalNames.js';
import lusitaniaNames from './lusitaniaNames.js';
import qharanNames from './qharanNames.js';

// Cultural name generators
const CULTURAL_GENERATORS = {
    aquilonian: aquilonianNames,
    barbarian: barbarianNames,
    oriental: orientalNames,
    lusitania: lusitaniaNames,
    qharan: qharanNames
};

// Atmospheric prefixes for monster names
const DARK_PREFIXES = [
    "Shadowfang", "Bloodclaw", "Deathwhisper", "Grimheart", "Voidcaller", "Bonegnawer", 
    "Nightstalker", "Soulrender", "Plaguebearer", "Doomhowler", "Cursebringer", "Fleshripper",
    "Darkbane", "Terrorwing", "Blightcaster", "Necrosworn", "Vilebreath", "Corpsewalker"
];

const NOBLE_PREFIXES = [
    "Goldenscale", "Brightflame", "Starwing", "Moonheart", "Sunbringer", "Stormcaller",
    "Ironbane", "Crystalclaw", "Silvermane", "Lightbearer", "Pridewalker", "Valorwing",
    "Oathkeeper", "Trueheart", "Justicebringer", "Honorbound", "Lightforge", "Brightshield"
];

const ELEMENTAL_PREFIXES = [
    "Frostborn", "Flameheart", "Stormwing", "Earthshaker", "Tidecaller", "Windwalker",
    "Emberforge", "Glacialmaw", "Thunderclaw", "Magmaheart", "Mistweaver", "Voidwind"
];

const ANCIENT_PREFIXES = [
    "Ancient", "Elder", "Primordial", "Forgotten", "Lost", "Timeworn", "Ageless", "Eternal",
    "Firstborn", "Oldblood", "Ancientheart", "Elderscale", "Primeval", "Dateless"
];

// Atmospheric suffixes
const DARK_SUFFIXES = [
    "the Corrupted", "the Fallen", "the Cursed", "the Damned", "the Twisted", "the Vile",
    "the Accursed", "the Betrayer", "the Defiler", "the Destroyer", "the Devourer", "the Tormentor",
    "of the Abyss", "of Shadows", "of Nightmares", "of the Void", "of Darkness", "of Death"
];

const NOBLE_SUFFIXES = [
    "the Noble", "the Righteous", "the Pure", "the Valiant", "the Just", "the Heroic",
    "the Magnificent", "the Glorious", "the Radiant", "the Majestic", "the Honorable", "the True",
    "of Light", "of Honor", "of Justice", "of Glory", "of Valor", "of Truth"
];

const ELEMENTAL_SUFFIXES = [
    "of the Inferno", "of the Glacier", "of the Storm", "of the Deep", "of the Winds", "of the Stone",
    "the Flamebringer", "the Frostcaller", "the Stormborn", "the Earthbound", "the Seaborn", "the Skywalker"
];

const ANCIENT_SUFFIXES = [
    "the Ancient", "the Timeless", "the Eternal", "the Ageless", "the Forgotten", "the Lost",
    "of Ages Past", "of Old", "of the First Days", "the Primordial", "the Elder", "the Firstborn"
];

const GENERAL_TITLES = [
    "the Mighty", "the Fierce", "the Terrible", "the Great", "the Powerful", "the Strong",
    "the Swift", "the Cunning", "the Wise", "the Bold", "the Wild", "the Savage",
    "the Relentless", "the Unstoppable", "the Fearsome", "the Legendary"
];

// Monster type associations for better naming
const MONSTER_TYPE_THEMES = {
    "Dragon": ["elemental", "ancient", "noble"],
    "Fiend": ["dark", "ancient"],
    "Undead": ["dark", "ancient"],
    "Celestial": ["noble", "elemental"],
    "Legendary": ["ancient", "noble", "elemental"],
    "Mount": ["elemental", "noble"],
    "Rider": ["cultural", "noble"]
};

/**
 * Generate a culturally-inspired monster name with metadata
 * @param {string} baseName - Original monster name
 * @param {string} monsterType - Type of monster (Dragon, Fiend, etc.)
 * @returns {object} Enhanced monster name with metadata
 */
export function generateMonsterName(baseName, monsterType = "Unknown") {
    const usePersonalName = Math.random() < 0.6; // 60% chance of personal name
    
    if (usePersonalName) {
        return generatePersonalName(baseName, monsterType);
    } else {
        return generateAtmosphericName(baseName, monsterType);
    }
}

/**
 * Generate monster name with a specific naming style (for group consistency)
 * @param {string} baseName - Original monster name
 * @param {string} monsterType - Type of monster 
 * @param {string} forcedStyle - Style to use ('atmospheric', 'aquilonian', etc.)
 * @returns {object} Enhanced monster name with metadata
 */
export function generateMonsterNameWithStyle(baseName, monsterType = "Unknown", forcedStyle) {
    if (forcedStyle === 'atmospheric') {
        return generateAtmosphericName(baseName, monsterType);
    } else if (CULTURAL_GENERATORS[forcedStyle]) {
        return generatePersonalNameWithStyle(baseName, monsterType, forcedStyle);
    } else {
        // Fallback to random generation
        return generateMonsterName(baseName, monsterType);
    }
}

/**
 * Generate a name using cultural generators + titles
 */
function generatePersonalName(baseName, monsterType) {
    // Choose a random cultural generator
    const cultures = Object.keys(CULTURAL_GENERATORS);
    const chosenCulture = cultures[Math.floor(Math.random() * cultures.length)];
    const nameGenerator = CULTURAL_GENERATORS[chosenCulture];
    
    // Determine gender randomly
    const gender = Math.random() < 0.5 ? "male" : "female";
    const personalName = nameGenerator(gender);
    
    // Get appropriate theme for this monster type
    const themes = MONSTER_TYPE_THEMES[monsterType] || ["general"];
    const theme = themes[Math.floor(Math.random() * themes.length)];
    
    // 70% chance to add an atmospheric title
    let finalName = personalName;
    if (Math.random() < 0.7) {
        const title = getThemeTitle(theme);
        finalName = `${personalName} ${title}`;
    }
    
    return {
        name: finalName,
        namingStyle: chosenCulture,
        nameType: 'personal'
    };
}

/**
 * Generate a name using a specific cultural generator
 */
function generatePersonalNameWithStyle(baseName, monsterType, forcedStyle) {
    const nameGenerator = CULTURAL_GENERATORS[forcedStyle];
    
    // Determine gender randomly
    const gender = Math.random() < 0.5 ? "male" : "female";
    const personalName = nameGenerator(gender);
    
    // Get appropriate theme for this monster type
    const themes = MONSTER_TYPE_THEMES[monsterType] || ["general"];
    const theme = themes[Math.floor(Math.random() * themes.length)];
    
    // 70% chance to add an atmospheric title
    let finalName = personalName;
    if (Math.random() < 0.7) {
        const title = getThemeTitle(theme);
        finalName = `${personalName} ${title}`;
    }
    
    return {
        name: finalName,
        namingStyle: forcedStyle,
        nameType: 'personal'
    };
}

/**
 * Generate atmospheric name using prefixes/suffixes
 */
function generateAtmosphericName(baseName, monsterType) {
    // Get appropriate theme for this monster type
    const themes = MONSTER_TYPE_THEMES[monsterType] || ["general"];
    const theme = themes[Math.floor(Math.random() * themes.length)];
    
    const usePrefix = Math.random() < 0.7; // 70% chance of prefix
    const useSuffix = Math.random() < 0.6; // 60% chance of suffix
    
    let name = baseName;
    
    if (usePrefix) {
        const prefix = getThemePrefix(theme);
        name = `${prefix} ${baseName}`;
    }
    
    if (useSuffix) {
        const suffix = getThemeSuffix(theme);
        name = usePrefix ? `${name} ${suffix}` : `${baseName} ${suffix}`;
    }
    
    // If neither prefix nor suffix, just return the base name
    if (!usePrefix && !useSuffix) {
        name = baseName;
    }
    
    return {
        name: name,
        namingStyle: 'atmospheric',
        nameType: 'title'
    };
}

/**
 * Get appropriate prefix for theme
 */
function getThemePrefix(theme) {
    switch (theme) {
        case "dark":
            return getRandomElement(DARK_PREFIXES);
        case "noble":
            return getRandomElement(NOBLE_PREFIXES);
        case "elemental":
            return getRandomElement(ELEMENTAL_PREFIXES);
        case "ancient":
            return getRandomElement(ANCIENT_PREFIXES);
        default:
            return getRandomElement([...DARK_PREFIXES, ...NOBLE_PREFIXES, ...ELEMENTAL_PREFIXES]);
    }
}

/**
 * Get appropriate suffix for theme
 */
function getThemeSuffix(theme) {
    switch (theme) {
        case "dark":
            return getRandomElement(DARK_SUFFIXES);
        case "noble":
            return getRandomElement(NOBLE_SUFFIXES);
        case "elemental":
            return getRandomElement(ELEMENTAL_SUFFIXES);
        case "ancient":
            return getRandomElement(ANCIENT_SUFFIXES);
        default:
            return getRandomElement(GENERAL_TITLES);
    }
}

/**
 * Get appropriate title for theme (used with personal names)
 */
function getThemeTitle(theme) {
    switch (theme) {
        case "dark":
            return getRandomElement(["the Dark", "the Shadow", "the Cursed", "the Fallen", "the Corrupted"]);
        case "noble":
            return getRandomElement(["the Noble", "the Just", "the Radiant", "the Glorious", "the Honorable"]);
        case "elemental":
            return getRandomElement(["the Stormcaller", "the Flameheart", "the Frostborn", "the Earthshaker"]);
        case "ancient":
            return getRandomElement(["the Ancient", "the Elder", "the Timeless", "the Primordial"]);
        default:
            return getRandomElement(["the Great", "the Mighty", "the Fierce", "the Legendary"]);
    }
}

/**
 * Utility: get random element from array
 */
function getRandomElement(array) {
    if (!array || array.length === 0) return "";
    return array[Math.floor(Math.random() * array.length)];
}

export default generateMonsterName;