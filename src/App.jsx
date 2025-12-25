import { useState } from 'react';
import { pickRandom, parseEntries } from './utils/randomizer';
import { splitIntoTeams } from './utils/teamGenerator';

function App() {
  const [activeTab, setActiveTab] = useState('picker');
  
  // Picker state
  const [inputText, setInputText] = useState('');
  const [entries, setEntries] = useState([]);
  const [winner, setWinner] = useState(null);
  const [pickMode, setPickMode] = useState('once');
  const [isAnimating, setIsAnimating] = useState(false);

  // Team state
  const [teamInput, setTeamInput] = useState('');
  const [teamEntries, setTeamEntries] = useState([]);
  const [teams, setTeams] = useState([]);
  const [teamMode, setTeamMode] = useState('byTeams');
  const [teamValue, setTeamValue] = useState('2');

  const handleUpdateEntries = () => {
    const parsed = parseEntries(inputText);
    setEntries(parsed);
    setWinner(null);
  };

  const handlePick = () => {
    if (entries.length === 0) {
      alert('Please add some entries first!');
      return;
    }

    setIsAnimating(true);

    // GA4 event
    if (window.gtag) {
      window.gtag('event', 'pick_random_click', {
        event_category: 'engagement',
        event_label: pickMode,
      });
    }

    setTimeout(() => {
      const removeAfterPick = pickMode === 'remove';
      const selected = pickRandom(entries, 1, false);
      setWinner(selected[0]);

      if (removeAfterPick) {
        const newEntries = entries.filter(e => e !== selected[0]);
        setEntries(newEntries);
        setInputText(newEntries.join('\n'));
      }

      setIsAnimating(false);
    }, 1000);
  };

  const handleClear = () => {
    setInputText('');
    setEntries([]);
    setWinner(null);
  };

  const handleUpdateTeamEntries = () => {
    const parsed = parseEntries(teamInput);
    setTeamEntries(parsed);
    setTeams([]);
  };

  const handleGenerateTeams = () => {
    if (teamEntries.length === 0) {
      alert('Please add some names first!');
      return;
    }
    
    const value = parseInt(teamValue, 10);
    if (!value || value < 1) {
      alert('Please enter a valid number!');
      return;
    }

    // GA4 event
    if (window.gtag) {
      window.gtag('event', 'generate_teams_click', {
        event_category: 'engagement',
        event_label: teamMode,
      });
    }

    const generatedTeams = splitIntoTeams(teamEntries, teamMode, value);
    setTeams(generatedTeams);
  };

  const handleClearTeams = () => {
    setTeamInput('');
    setTeamEntries([]);
    setTeams([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Random Picker
          </h1>
          <p className="text-gray-600">
            Free tool to pick random names, winners, or make decisions
          </p>
        </header>

        {/* Tabs */}
        <div className="flex justify-center mb-6 bg-white rounded-xl shadow-md p-1">
          <button
            onClick={() => setActiveTab('picker')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition ${
              activeTab === 'picker'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🎯 Random Picker
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition ${
              activeTab === 'teams'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            👥 Team Generator
          </button>
        </div>

        {/* Picker Tab */}
        {activeTab === 'picker' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                     <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pick Mode:
              </label>
              <select 
                value={pickMode}
                onChange={(e) => setPickMode(e.target.value)}
                className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="once">Pick Once (keep in list)</option>
                <option value="remove">Pick and Remove</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter names or items (one per line):
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={"Alice\nBob\nCharlie\nDiana"}
                className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={handleClear}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleUpdateEntries}
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
                  >
                    Update List
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handlePick}
              disabled={isAnimating || entries.length === 0}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xl rounded-xl shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnimating ? '🎲 Picking...' : '🎯 Pick Random'}
            </button>

            {winner && !isAnimating && (
              <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl animate-bounce">
                <p className="text-sm font-medium text-gray-600 mb-1">Winner:</p>
                <p className="text-3xl font-bold text-green-700">{winner}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(winner)}
                  className="mt-3 text-sm text-green-600 hover:text-green-700 underline"
                >
                  📋 Copy to clipbo              </button>
              </div>
            )}
          </div>
        )}

        {/* Teams Tab */}
        {activeTab === 'teams' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Split by:
              </label>
              <div className="flex gap-4">
                <select 
                  value={teamMode}
                  onChange={(e) => setTeamMode(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="byTeams">Number of Teams</option>
                  <option value="bySize">People per Team</option>
                </select>
                <input
                  type="number"
                  min="1"
                  value={teamValue}
                  onChange={(e) => setTeamValue(e.target.value)}
                  className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter names (one per line):
              </label>
              <textarea
                value={teamInput}
                onChange={(e) => setTeamInput(e.target.value)}
                placeholder={"Alice\nBob\nCharlie\nDiana\nEve\nFrank"}
                className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {teamEntries.length} {teamEntries.length === 1 ? 'person' : 'people'}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={handleClearTeams}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleUpdateTeamEntries}
                    className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
                  >
                    Update List
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerateTeams}
              disabled={teamEntries.length === 0}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold text-xl rounded-xl shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              👥 Generate Teams
            </button>

            {teams.length > 0 && (
              <div className="mt-6 space-y-4">
                {teams.map((team, idx) => (
                  <div key={idx} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl">
                    <p className="text-sm font-medium text-gray-600 mb-2">Team {idx + 1}:</p>
                    <div className="flex flex-wrap gap-2">
                      {team.map((member, mIdx) => (
                        <span key={mIdx} className="px-3 py-1 bg-white rounded-full text-sm font-medium text-purple-700 shadow-sm">
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* How to use */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800b-3">How to use:</h2>
          
          {activeTab === 'picker' && (
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Type or paste names/items (one per line) in the text box.</li>
              <li>Click "Update List" to load your entries.</li>
              <li>Choose your pick mode (keep in list or remove after picking).</li>
              <li>Click "Pick Random" to select a winner.</li>
              <li>Use "Pick and Remove" mode for multiple rounds of selection.</li>
            </ol>
          )}

          {activeTab === 'teams' && (
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Enter all participant names (one per line).</li>
              <li>Choose to split by number of teams or people per team.</li>
              <li>Click "Update List" then "Generate Teams".</li>
              <li>Teams are randomly and fairly distributed.</li>
              <li>Click "Generate Teams" again to re-shuffle.</li>
            </ol>
          )}
        </div>

        {/* About/Privacy/Contact */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-6 space-y-4">
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-1">About</h2>
            <p className="text-sm text-gray-700">
              Random Picker is a simple tool for teachers, hosts, and creators who need a fair way to pick names, create teams, or make decisions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-1">Privacy</h2>
            <p className="text-sm text-gray-700">
              Names you enter never leave your browser. We use Google Analytics 4 to collect anonymous usage stats to improve the tool.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-1">Contact</h2>
            <p className="text-sm text-gray-700">
              Have feedback or feature ideas? Email me at <span className="underline">yourname@example.com</span>.
            </p>
          </section>
        </div>

        <footer className="text-center mt-8 text-gray-600 text-sm">
          <p>Free Random Picker & Team Generator • No signup required • Fair & unbiased</p>
          <p className="mt-1">&copy; {new Date().getFullYear()} Random Picker by Vamsi</p>
        </footer>

      </div>
    </div>
  );
}

export default App;
