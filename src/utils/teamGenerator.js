export function splitIntoTeams(entries, mode, value) {
  // mode: 'byTeams' or 'bySize'
  // value: number of teams OR number per team
  
  const shuffled = [...entries].sort(() => Math.random() - 0.5);
  const teams = [];

  if (mode === 'byTeams') {
    const numTeams = parseInt(value, 10);
    if (numTeams < 1) return [];
    
    for (let i = 0; i < numTeams; i++) {
      teams.push([]);
    }
    
    shuffled.forEach((name, idx) => {
      teams[idx % numTeams].push(name);
    });
  } else {
    // bySize
    const teamSize = parseInt(value, 10);
    if (teamSize < 1) return [];
    
    for (let i = 0; i < shuffled.length; i += teamSize) {
      teams.push(shuffled.slice(i, i + teamSize));
    }
  }
  
  return teams;
}
