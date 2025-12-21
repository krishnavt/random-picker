import { useState } from 'react';
import { pickRandom, parseEntries } from './utils/randomizer';

function App() {
  const [inputText, setInputText] = useState('');
  const [entries, setEntries] = useState([]);
  const [winner, setWinner] = useState(null);
  const [pickMode, setPickMode] = useState('once');
  const [isAnimating, setIsAnimating] = useState(false);

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
              placeholder="Alice&#10;Bob&#10;Charlie&#10;Diana"
              className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
              </span>
              <div className="space-x-2">
                <button
                  onClick={handleClear}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
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
                📋 Copy to clipboard
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">How to use:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Type or paste names/items (one per line) in the text box above</li>
            <li>Click "Update List" to load your entries</li>
            <li>Choose your pick mode (keep in list or remove after picking)</li>
            <li>Click "Pick Random" to select a winner</li>
            <li>Use "Pick and Remove" mode for multiple rounds of selection</li>
          </ol>
        </div>

        <footer className="text-center mt-8 text-gray-600 text-sm">
          <p>Free Random Picker Tool • No signup required • Fair & unbiased</p>
        </footer>

      </div>
    </div>
  );
}

export default App;
