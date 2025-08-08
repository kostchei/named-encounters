import React, { useState, useEffect, useCallback } from 'react';
import XP_TABLE from './data/enc_xp.json';
import { generateEncounter } from './encounterSystem.js';
import './App.css';

function App() {
  // Party configuration
  const [lines, setLines] = useState([{ level: 1, count: 1 }]);
  const [difficulty, setDifficulty] = useState('High');
  const [resolvedDifficulty, setResolvedDifficulty] = useState('High');
  
  // Current encounter
  const [currentEncounter, setCurrentEncounter] = useState(null);
  
  // Saved encounters
  const [savedEncounters, setSavedEncounters] = useState([]);
  
  // Load saved encounters from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dnd-named-encounters');
    if (saved) {
      try {
        setSavedEncounters(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved encounters:', error);
      }
    }
  }, []);
  
  // Save encounters to localStorage whenever savedEncounters changes
  useEffect(() => {
    localStorage.setItem('dnd-named-encounters', JSON.stringify(savedEncounters));
  }, [savedEncounters]);

  // Calculate total XP from the party input
  const calculateTotalXP = useCallback(() => {
    let total = 0;
    lines.forEach((line) => {
      const xpRow = XP_TABLE[line.level];
      if (xpRow) {
        total += xpRow[resolvedDifficulty] * line.count;
      }
    });
    return total;
  }, [lines, resolvedDifficulty]);

  const [totalXP, setTotalXP] = useState(calculateTotalXP());

  useEffect(() => {
    setTotalXP(calculateTotalXP());
  }, [calculateTotalXP]);

  const handleDifficultyChange = (e) => {
    const choice = e.target.value;
    setDifficulty(choice);

    if (choice === 'Random') {
      const possibilities = ['Low', 'Moderate', 'High'];
      const newResolvedDifficulty = possibilities[Math.floor(Math.random() * possibilities.length)];
      setResolvedDifficulty(newResolvedDifficulty);
    } else {
      setResolvedDifficulty(choice);
    }
  };

  const addLine = () => {
    if (lines.length < 3) {
      setLines((prev) => [...prev, { level: 1, count: 1 }]);
    }
  };

  const handleLineChange = (index, field, value) => {
    const newLines = [...lines];
    newLines[index][field] = parseInt(value, 10);
    setLines(newLines);
  };

  const handleGenerateEncounter = () => {
    const allLevels = lines.map((l) => l.level);
    const partySize = lines.reduce((sum, l) => sum + l.count, 0);

    const newEncounter = generateEncounter(totalXP, allLevels, partySize);
    setCurrentEncounter(newEncounter);
  };
  
  const handleSaveEncounter = () => {
    if (currentEncounter && !currentEncounter.error) {
      setSavedEncounters(prev => [currentEncounter, ...prev]);
    }
  };
  
  const handleDeleteEncounter = (id) => {
    setSavedEncounters(prev => prev.filter(enc => enc.id !== id));
  };
  
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all saved encounters?')) {
      setSavedEncounters([]);
    }
  };

  const renderMonsterTable = (monsters, encounter) => {
    if (!monsters || monsters.length === 0) return null;
    
    return (
      <div className="monster-table-container">
        <table className="monster-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Display Name</th>
              <th>Type/Role</th>
              <th>CR</th>
              <th>Theme</th>
              <th>Naming Style</th>
              <th>Traits</th>
            </tr>
          </thead>
          <tbody>
            {monsters.map((monster, index) => (
              <tr key={index}>
                <td>
                  {monster.Name || 
                   (monster.mount && monster.rider ? `${monster.rider.Name} & ${monster.mount.Name}` : '') ||
                   monster.mount?.Name ||
                   monster.rider?.Name ||
                   'Unknown'}
                </td>
                <td className="display-name">{monster.displayName}</td>
                <td>
                  {monster.role && <span className={`role ${monster.role}`}>{monster.role}</span>}
                  {monster.type && <span className="type">{monster.type}</span>}
                  {monster.Type && <span className="type">{monster.Type}</span>}
                  {monster.type === 'pair' && <span className="detail">Mounted</span>}
                  {monster.type === 'dismounted' && <span className="detail">Dismounted</span>}
                </td>
                <td>
                  {monster.CR || 
                   (monster.mountCR && monster.riderCR ? `${monster.mountCR}/${monster.riderCR}` : '') ||
                   monster.mountCR ||
                   monster.riderCR ||
                   '?'}
                </td>
                <td className="theme">
                  {monster.theme || 'Unknown'}
                </td>
                <td className="naming-style">
                  {monster.namingStyle === 'atmospheric' ? 'Atmospheric' : 
                   monster.namingStyle === 'aquilonian' ? 'Aquilonian' :
                   monster.namingStyle === 'barbarian' ? 'Barbarian' :
                   monster.namingStyle === 'oriental' ? 'Oriental' :
                   monster.namingStyle === 'lusitania' ? 'Lusitanian' :
                   monster.namingStyle === 'qharan' ? 'Q\'haran' :
                   monster.namingStyle || 'Unknown'}
                </td>
                <td className="monster-traits">
                  {monster.traits && monster.traits.length > 0 ? 
                    monster.traits.join(', ') : 
                    'None'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderEncounterCard = (encounter, isCurrentEncounter = false) => {
    if (!encounter || encounter.error) {
      return (
        <div className="encounter-card error">
          <h3>Error</h3>
          <p>{encounter?.error || 'Unknown error occurred'}</p>
        </div>
      );
    }

    return (
      <div className={`encounter-card ${isCurrentEncounter ? 'current' : 'saved'}`}>
        <div className="encounter-header">
          <h3>{encounter.category}</h3>
          {!isCurrentEncounter && (
            <button 
              className="delete-btn"
              onClick={() => handleDeleteEncounter(encounter.id)}
              title="Delete encounter"
            >
              ✕
            </button>
          )}
        </div>
        
        <div className="encounter-stats">
          <span>Quantity: {encounter.quantity}</span>
          <span>XP Used: {encounter.totalXP?.toLocaleString() || 'N/A'}</span>
          {encounter.terrain && <span>Terrain: {encounter.terrain}</span>}
          {encounter.distance && <span>Distance: {encounter.distance} ft</span>}
          {encounter.timestamp && (
            <span>Generated: {new Date(encounter.timestamp).toLocaleString()}</span>
          )}
        </div>
        
        {encounter.tarotMotivation && (
          <div className="tarot-motivation-section">
            <h4>Encounter Tarot Reading</h4>
            <div className="tarot-card">
              <h5>{encounter.tarotMotivation.card} [{encounter.tarotMotivation.orientation}]</h5>
              <p className="tarot-description">{encounter.tarotMotivation.description}</p>
            </div>
            <div className="tarot-meanings">
              <div className="tarot-meaning">
                <strong>{encounter.tarotMotivation.contextType}:</strong> {encounter.tarotMotivation.contextContent}
              </div>
            </div>
          </div>
        )}
        
        {encounter.motivation && (
          <div className="motivation-section">
            <h4>Why This Encounter?</h4>
            <p className="motivation-category">{encounter.motivation.category}</p>
            <p className="motivation-description">{encounter.motivation.description}</p>
          </div>
        )}
        
        {renderMonsterTable(encounter.monsters, encounter)}
        
        {isCurrentEncounter && (
          <button className="save-btn" onClick={handleSaveEncounter}>
            Save This Encounter
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>D&D Named Encounters Generator</h1>
        <p>Generate encounters with unique monster names and party motivations</p>
      </header>

      <div className="main-content">
        <div className="generator-section">
          <h2>Party Configuration</h2>
          
          <div className="config-row">
            <label htmlFor="difficulty">Difficulty:</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={handleDifficultyChange}
            >
              <option value="Low">Low</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
              <option value="Random">Random</option>
            </select>
          </div>

          <p className="current-difficulty">
            Currently using: <strong>{resolvedDifficulty} XP Encounter</strong>
          </p>

          {lines.map((line, index) => (
            <div key={index} className="party-line">
              <label>Level:</label>
              <select
                value={line.level}
                onChange={(e) => handleLineChange(index, 'level', e.target.value)}
              >
                {Array.from({ length: 20 }, (_, i) => i + 1).map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>

              <label># of Characters:</label>
              <select
                value={line.count}
                onChange={(e) => handleLineChange(index, 'count', e.target.value)}
              >
                {Array.from({ length: 8 }, (_, i) => i + 1).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          ))}

          {lines.length < 3 && (
            <button onClick={addLine} className="add-line-btn">
              + Add Another Line
            </button>
          )}

          <div className="xp-budget">
            <h3>Total XP Budget: {totalXP.toLocaleString()}</h3>
          </div>

          <button onClick={handleGenerateEncounter} className="generate-btn">
            Generate Named Encounter
          </button>
        </div>

        <div className="encounters-section">
          {currentEncounter && (
            <div className="current-encounter">
              <h2>Current Encounter</h2>
              {renderEncounterCard(currentEncounter, true)}
            </div>
          )}

          <div className="saved-encounters">
            <div className="saved-header">
              <h2>Saved Encounters ({savedEncounters.length})</h2>
              {savedEncounters.length > 0 && (
                <button onClick={handleClearAll} className="clear-all-btn">
                  Clear All
                </button>
              )}
            </div>
            
            {savedEncounters.length === 0 ? (
              <p className="no-encounters">No saved encounters yet. Generate and save some encounters!</p>
            ) : (
              <div className="encounters-grid">
                {savedEncounters.map((encounter) => (
                  <div key={encounter.id}>
                    {renderEncounterCard(encounter, false)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
