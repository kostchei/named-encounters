// Enhanced encounter system without theme restrictions
import CR_XP_TABLE from './data/cr_xp.json';
import DRAGONS from './data/dragon.json';
import LEGENDARY from './data/legendary.json';
import MOUNTS from './data/mounts.json';
import RIDERS from './data/riders.json';
import MONSTERS_BY_CR from './data/enc_by_cr.json';
import MOTIVATIONS from './data/motivations.json';
import TAROT_CARDS from './data/tarot.json';
import TRAITS from './data/traits.json';
import { generateMonsterName, generateMonsterNameWithStyle } from './nameGenerators/monsterNameGenerator.js';

// Helper function to get random element from array
function getRandomElement(array) {
  if (!array || array.length === 0) return null;
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to roll dice
function rollDice(numDice, sides) {
  let total = 0;
  for (let i = 0; i < numDice; i++) {
    total += Math.floor(Math.random() * sides) + 1;
  }
  return total;
}

// Distance generation based on terrain type
const terrainDistanceMap = {
  'Open/Desert/Arctic': () => rollDice(6, 6) * 10,
  'Forest': () => rollDice(2, 8) * 10,
  'Hills/Urban': () => rollDice(2, 10) * 10,
  'Mountains': () => rollDice(4, 10) * 10,
  'Jungle/Indoors': () => rollDice(2, 6) * 10,
};

// Generate encounter distance and terrain
function generateDistanceAndTerrain() {
  const terrainOptions = Object.keys(terrainDistanceMap);
  const chosenTerrain = getRandomElement(terrainOptions);
  const distanceFn = terrainDistanceMap[chosenTerrain];
  const distance = distanceFn ? distanceFn() : 0;
  
  return {
    terrain: chosenTerrain,
    distance: distance
  };
}

// Generate enhanced tarot-based motivation for the encounter
function generateTarotMotivation() {
  const chosenCard = getRandomElement(TAROT_CARDS);
  const isUpright = Math.random() < 0.5;
  const orientation = isUpright ? "Upright" : "Reversed";
  const meanings = isUpright ? chosenCard.upright_meaning : chosenCard.reversed_meaning;
  
  // Randomly pick one of the four contexts to display
  const contexts = [
    { type: 'Creature Motivation', content: meanings.creature_or_trap },
    { type: 'Situation', content: meanings.situation },
    { type: 'Place', content: meanings.place },
    { type: 'Treasure Context', content: meanings.treasure }
  ];
  
  const selectedContext = getRandomElement(contexts);
  
  return {
    card: chosenCard.title,
    orientation: orientation,
    description: chosenCard.description,
    contextType: selectedContext.type,
    contextContent: selectedContext.content
  };
}

// Generate virtue/vice traits for monsters
function generateMonsterTraits() {
  const numTraits = Math.floor(Math.random() * 2) + 1; // 1-2 traits per monster
  const shuffledTraits = [...TRAITS].sort(() => Math.random() - 0.5);
  const chosenTraits = shuffledTraits.slice(0, numTraits);
  
  return chosenTraits.map(traitPair => {
    const [virtue, vice] = traitPair.split('/').map(t => t.trim());
    // 60% chance of virtue, 40% chance of vice for more interesting monsters
    const isVirtue = Math.random() < 0.4; // Actually favor vices for monsters
    return isVirtue ? virtue : vice;
  });
}

// Generate names for a group with consistent styling
function generateGroupNames(monsters) {
  if (monsters.length === 0) return [];
  
  // 75% chance of using 1 naming type, 25% chance of using 2 types
  const useConsistentNaming = Math.random() < 0.75;
  
  if (useConsistentNaming || monsters.length === 1) {
    // Use same naming style for all monsters
    const firstMonster = monsters[0];
    const baseName = firstMonster.Name || firstMonster.mount?.Name || firstMonster.rider?.Name || 'Unknown';
    const monsterType = firstMonster.Type || firstMonster.mount?.Type || firstMonster.rider?.Type || 'Unknown';
    
    // Generate one name to determine the style to use for the group
    const groupNameData = generateMonsterName(baseName, monsterType);
    const groupNamingStyle = groupNameData.namingStyle;
    
    // Apply this style to all monsters in the group
    return monsters.map(monster => {
      const baseName = monster.Name || monster.mount?.Name || monster.rider?.Name || 'Unknown';
      const monsterType = monster.Type || monster.mount?.Type || monster.rider?.Type || 'Unknown';
      
      // Force the same naming style for consistency
      const nameData = generateMonsterNameWithStyle(baseName, monsterType, groupNamingStyle);
      const traits = generateMonsterTraits();
      const theme = monster.Theme || monster.mount?.Theme || monster.rider?.Theme || 'Unknown';
      
      return {
        ...monster,
        displayName: nameData.name,
        namingStyle: nameData.namingStyle,
        nameType: nameData.nameType,
        theme: theme,
        traits: traits
      };
    });
  } else {
    // Use mixed naming styles (2 different styles max)
    const styles = ['atmospheric', 'aquilonian', 'barbarian', 'oriental', 'lusitania', 'qharan'];
    const chosenStyles = styles.sort(() => Math.random() - 0.5).slice(0, 2);
    
    return monsters.map((monster, index) => {
      const baseName = monster.Name || monster.mount?.Name || monster.rider?.Name || 'Unknown';
      const monsterType = monster.Type || monster.mount?.Type || monster.rider?.Type || 'Unknown';
      const theme = monster.Theme || monster.mount?.Theme || monster.rider?.Theme || 'Unknown';
      
      // Alternate between the two chosen styles
      const styleToUse = chosenStyles[index % 2];
      const nameData = generateMonsterNameWithStyle(baseName, monsterType, styleToUse);
      const traits = generateMonsterTraits();
      
      return {
        ...monster,
        displayName: nameData.name,
        namingStyle: nameData.namingStyle,
        nameType: nameData.nameType,
        theme: theme,
        traits: traits
      };
    });
  }
}

// Legacy motivation function (keeping for fallback)
// eslint-disable-next-line no-unused-vars
function generateMotivation() {
  const motivationCategory = getRandomElement(MOTIVATIONS);
  const specificMotivation = getRandomElement(motivationCategory.motivations);
  return {
    category: motivationCategory.category,
    description: specificMotivation
  };
}

// Helper function to get monsters by CR from any source (ignoring theme)
function getMonstersByCR(cr, source = 'all') {
  const crString = String(cr);
  
  if (source === 'dragons') {
    return DRAGONS.filter(dragon => String(dragon.CR) === crString);
  }
  
  if (source === 'legendary') {
    return LEGENDARY.filter(legendary => String(legendary.CR) === crString);
  }
  
  if (source === 'mounts') {
    return MOUNTS.filter(mount => String(mount.CR) === crString);
  }
  
  if (source === 'riders') {
    return RIDERS.filter(rider => String(rider.CR) === crString);
  }
  
  if (source === 'original') {
    const crData = MONSTERS_BY_CR.find(entry => entry.challenge_rating === crString);
    if (crData) {
      // Return all monsters from all themes combined
      return Object.entries(crData)
        .filter(([key, value]) => key !== 'challenge_rating' && Array.isArray(value))
        .flatMap(([theme, monsters]) => 
          monsters.map(name => ({ Name: name, CR: crString, Theme: theme }))
        );
    }
  }
  
  return [];
}

// Find the best CR that fits within a budget
function findBestCR(budget) {
  let bestCR = null;
  let bestCRXP = 0;
  
  for (let crString in CR_XP_TABLE) {
    const xpValue = CR_XP_TABLE[crString];
    if (xpValue <= budget && xpValue > bestCRXP) {
      bestCR = crString;
      bestCRXP = xpValue;
    }
  }
  
  return { cr: bestCR, xp: bestCRXP };
}

/**
 * Generate encounter using enhanced system without theme restrictions
 * @param {number} totalXP - Total XP budget
 * @param {number[]} levels - Array of character levels  
 * @param {number} partySize - Number of characters
 * @returns {object} - Enhanced encounter result object
 */
export function generateEncounter(totalXP, levels, partySize) {
  // Calculate quantity range: 2 to 2×party size (max 10)
  const minQuantity = 2;
  const maxQuantity = Math.min(partySize * 2, 10);
  
  // Randomly select encounter category
  const categories = ['dragon_legendary', 'mounts_riders', 'groups', 'mixed_groups'];
  const selectedCategory = getRandomElement(categories);
  
  // Generate tarot motivation and distance/terrain
  const tarotMotivation = generateTarotMotivation();
  const distanceInfo = generateDistanceAndTerrain();
  
  let encounter;
  switch (selectedCategory) {
    case 'dragon_legendary':
      encounter = generateDragonLegendary(totalXP);
      break;
      
    case 'mounts_riders':
      encounter = generateMountsRiders(totalXP, minQuantity, maxQuantity);
      break;
      
    case 'groups':
      encounter = generateGroups(totalXP, minQuantity, maxQuantity);
      break;
      
    case 'mixed_groups':
      encounter = generateMixedGroups(totalXP, minQuantity, maxQuantity);
      break;
      
    default:
      encounter = { error: 'Unknown encounter category' };
  }
  
  // Add tarot motivation, distance/terrain info, and generate names/traits for all monsters
  if (encounter && !encounter.error) {
    encounter.tarotMotivation = tarotMotivation;
    encounter.terrain = distanceInfo.terrain;
    encounter.distance = distanceInfo.distance;
    
    // Use group naming for consistent styles within encounters
    encounter.monsters = generateGroupNames(encounter.monsters);
    encounter.id = Date.now() + Math.random(); // Unique ID for storage
    encounter.timestamp = new Date().toISOString();
  }
  
  return encounter;
}

// Dragon or Legendary encounter (always 1 monster)
function generateDragonLegendary(totalXP) {
  const bestFit = findBestCR(totalXP);
  if (!bestFit.cr) {
    return { error: 'No dragon or legendary creature fits budget' };
  }
  
  // Get all dragons and legendary creatures, ignore theme
  let dragons = getMonstersByCR(bestFit.cr, 'dragons');
  let legendaries = getMonstersByCR(bestFit.cr, 'legendary');
  
  let allOptions = [...dragons, ...legendaries];
  
  if (allOptions.length === 0) {
    return { error: `No dragon or legendary creature found for CR ${bestFit.cr}` };
  }
  
  const chosen = getRandomElement(allOptions);
  return {
    category: 'Dragon or Legendary',
    quantity: 1,
    monsters: [chosen],
    totalXP: bestFit.xp,
    description: `${chosen.Name} (CR ${chosen.CR})`
  };
}

// Mounts and Riders encounter - ensure at least 2 creatures and spend leftover XP
function generateMountsRiders(totalXP, minQuantity, maxQuantity) {
  const targetQuantity = Math.max(2, Math.floor(Math.random() * (maxQuantity - minQuantity + 1)) + minQuantity);
  
  // Get all available mounts and riders sorted by XP (descending)
  const availableMounts = MOUNTS.map(mount => ({
    ...mount,
    xp: CR_XP_TABLE[mount.CR] || 0
  })).sort((a, b) => b.xp - a.xp);
  
  const availableRiders = RIDERS.map(rider => ({
    ...rider,
    xp: CR_XP_TABLE[rider.CR] || 0
  })).sort((a, b) => b.xp - a.xp);
  
  const results = [];
  let totalUsedXP = 0;
  let remainingXP = totalXP;
  
  // Try to create mount+rider pairs first, then individual riders
  let attemptPairs = Math.random() < 0.7; // 70% chance to prefer pairs
  
  while (results.length < targetQuantity && remainingXP > 0) {
    let addedCreature = false;
    
    if (attemptPairs && availableMounts.length > 0 && availableRiders.length > 0) {
      // Find best mount+rider combination that fits
      let bestCombo = null;
      let bestComboXP = 0;
      
      for (const mount of availableMounts) {
        for (const rider of availableRiders) {
          const totalComboXP = mount.xp + rider.xp;
          if (totalComboXP <= remainingXP && totalComboXP > bestComboXP) {
            bestCombo = { mount, rider, totalXP: totalComboXP };
            bestComboXP = totalComboXP;
          }
        }
      }
      
      if (bestCombo) {
        results.push({ 
          mount: bestCombo.mount, 
          rider: bestCombo.rider, 
          type: 'pair',
          mountCR: bestCombo.mount.CR,
          riderCR: bestCombo.rider.CR,
          Name: `${bestCombo.rider.Name} & ${bestCombo.mount.Name}`,
          CR: `${bestCombo.rider.CR}/${bestCombo.mount.CR}`,
          Type: `${bestCombo.rider.Type} & ${bestCombo.mount.Type}`,
          Theme: bestCombo.rider.Theme // Use rider's theme for naming
        });
        totalUsedXP += bestComboXP;
        remainingXP -= bestComboXP;
        addedCreature = true;
      } else {
        // Can't make more pairs, switch to individual riders
        attemptPairs = false;
      }
    }
    
    // If we couldn't add a pair or don't want pairs, try individual riders
    if (!addedCreature && availableRiders.length > 0) {
      // eslint-disable-next-line no-loop-func
      const bestRider = availableRiders.find(rider => rider.xp <= remainingXP);
      
      if (bestRider) {
        results.push({ 
          rider: bestRider, 
          type: 'dismounted',
          riderCR: bestRider.CR,
          Name: bestRider.Name,
          CR: bestRider.CR,
          Type: bestRider.Type,
          Theme: bestRider.Theme
        });
        totalUsedXP += bestRider.xp;
        remainingXP -= bestRider.xp;
        addedCreature = true;
      }
    }
    
    // If we can't add anything, break out
    if (!addedCreature) {
      break;
    }
  }
  
  // Try to spend leftover XP on additional creatures if we have room
  const maxCreatures = Math.min(maxQuantity, 8); // Cap at reasonable number
  while (results.length < maxCreatures && remainingXP > 0) {
    // Try to add more riders with remaining XP
    // eslint-disable-next-line no-loop-func
    const affordableRiders = availableRiders.filter(rider => rider.xp <= remainingXP);
    if (affordableRiders.length === 0) break;
    
    const chosenRider = getRandomElement(affordableRiders);
    results.push({ 
      rider: chosenRider, 
      type: 'dismounted',
      riderCR: chosenRider.CR,
      Name: chosenRider.Name,
      CR: chosenRider.CR,
      Type: chosenRider.Type
    });
    totalUsedXP += chosenRider.xp;
    remainingXP -= chosenRider.xp;
  }
  
  // Ensure we have at least 2 creatures
  if (results.length < 2) {
    return { error: 'Could not generate at least 2 mounts/riders within XP budget' };
  }
  
  return {
    category: 'Mounts and Riders',
    quantity: results.length,
    monsters: results,
    totalXP: totalUsedXP,
    description: formatMountRiderDescription(results)
  };
}

// Groups encounter (same creature type)
function generateGroups(totalXP, minQuantity, maxQuantity) {
  const quantity = Math.floor(Math.random() * (maxQuantity - minQuantity + 1)) + minQuantity;
  const xpPerCreature = totalXP / quantity;
  
  const bestFit = findBestCR(xpPerCreature);
  if (!bestFit.cr) {
    return { error: 'No creature fits per-creature budget for group' };
  }
  
  // Get creatures from original monster data (all themes combined)
  const availableCreatures = getMonstersByCR(bestFit.cr, 'original');
  if (availableCreatures.length === 0) {
    return { error: `No creatures found for CR ${bestFit.cr} group encounter` };
  }
  
  const chosenCreature = getRandomElement(availableCreatures);
  const totalUsedXP = bestFit.xp * quantity;
  
  return {
    category: 'Groups',
    quantity: quantity,
    monsters: Array(quantity).fill(chosenCreature),
    totalXP: totalUsedXP,
    description: `${quantity}× ${chosenCreature.Name} (CR ${chosenCreature.CR} each)`
  };
}

// Mixed Groups encounter (different creature types, max 3 types)
function generateMixedGroups(totalXP, minQuantity, maxQuantity) {
  const quantity = Math.floor(Math.random() * (maxQuantity - minQuantity + 1)) + minQuantity;
  const maxCreatureTypes = 3;
  
  const results = [];
  let totalUsedXP = 0;
  let remainingXP = totalXP;
  let remainingCreatures = quantity;
  const usedCreatureTypes = new Set();
  
  // Distribute creatures across up to 3 different types
  while (remainingCreatures > 0 && remainingXP > 0 && usedCreatureTypes.size < maxCreatureTypes) {
    // Decide how many creatures of this type to add (1-4, but not more than remaining)
    const creaturesOfThisType = Math.min(
      Math.floor(Math.random() * 4) + 1, 
      remainingCreatures
    );
    
    // Calculate XP per creature for this group
    const xpPerCreature = remainingXP / remainingCreatures;
    const bestFit = findBestCR(xpPerCreature);
    
    if (!bestFit.cr) break;
    
    const availableCreatures = getMonstersByCR(bestFit.cr, 'original');
    if (availableCreatures.length === 0) break;
    
    // Select a creature type we haven't used yet
    let chosenCreature;
    let attempts = 0;
    do {
      chosenCreature = getRandomElement(availableCreatures);
      attempts++;
    } while (usedCreatureTypes.has(chosenCreature.Name) && attempts < 20);
    
    if (chosenCreature) {
      // Determine role: first creature is leader, others are minions/support
      const role = results.length === 0 ? 'leader' : 
                   (usedCreatureTypes.size === 0 ? 'elite' : 'minion');
      
      // Add creatures of this type
      for (let i = 0; i < creaturesOfThisType && remainingCreatures > 0; i++) {
        results.push({ 
          ...chosenCreature, 
          role: role,
          creatureTypeId: usedCreatureTypes.size // Group ID for formatting
        });
        totalUsedXP += bestFit.xp;
        remainingXP -= bestFit.xp;
        remainingCreatures--;
      }
      
      usedCreatureTypes.add(chosenCreature.Name);
    } else {
      break; // Couldn't find a new creature type
    }
  }
  
  return {
    category: 'Mixed Groups',
    quantity: results.length,
    monsters: results,
    totalXP: totalUsedXP,
    description: formatMixedGroupDescription(results)
  };
}

// Helper functions for formatting descriptions
function formatMountRiderDescription(results) {
  const pairs = results.filter(r => r.type === 'pair');
  const dismounted = results.filter(r => r.type === 'dismounted');
  
  let desc = '';
  
  if (pairs.length > 0) {
    const pairDescriptions = pairs.map(pair => 
      `${pair.rider.Name} on ${pair.mount.Name}`
    );
    desc += `${pairs.length} mounted: ${pairDescriptions.join(', ')}`;
  }
  
  if (dismounted.length > 0) {
    if (desc) desc += '; ';
    const dismountedDescriptions = dismounted.map(d => d.rider.Name);
    desc += `${dismounted.length} dismounted: ${dismountedDescriptions.join(', ')}`;
  }
  
  return desc;
}

function formatMixedGroupDescription(results) {
  // Group by creature type
  const creatureGroups = {};
  results.forEach(monster => {
    const key = monster.Name;
    if (!creatureGroups[key]) {
      creatureGroups[key] = {
        name: monster.Name,
        cr: monster.CR,
        role: monster.role,
        count: 0
      };
    }
    creatureGroups[key].count++;
  });
  
  // Format description showing each creature type
  const descriptions = Object.values(creatureGroups).map(group => {
    const roleText = group.role === 'leader' ? 'leader' : 
                     group.role === 'elite' ? 'elite' : 'support';
    return `${group.count}× ${group.name} (${roleText}, CR ${group.cr})`;
  });
  
  return descriptions.join(' + ');
}