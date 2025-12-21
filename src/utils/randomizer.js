export function pickRandom(entries, count = 1, removeAfterPick = false) {
  if (!entries || entries.length === 0) return [];
  
  const array = [...entries];
  const results = [];
  
  for (let i = 0; i < Math.min(count, array.length); i++) {
    const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % array.length;
    results.push(array[randomIndex]);
    
    if (removeAfterPick) {
      array.splice(randomIndex, 1);
    }
  }
  
  return results;
}

export function parseEntries(text) {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}
