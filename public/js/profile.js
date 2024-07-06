document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch(`/api/stats`);
      const stats = await response.json();
  
      document.getElementById('played-matches').textContent = stats.matchesPlayed;

      document.getElementById('victories').textContent = stats.victories;

      document.getElementById('defeats').textContent = stats.defeats;

      document.getElementById('weak-point').textContent = stats.weakPoint;

      document.getElementById('nemesis').textContent = stats.nemesis;

      document.getElementById('avg-hits').textContent = stats.avgHitsPerMatch;

      document.getElementById('avg-failures').textContent = stats.avgFailuresPerMatch;

      document.getElementById('avg-failures-before-first-hit').textContent = stats.avgFailuresBeforeFirstHit;

  
    } catch (error) {
      console.error('Error fetching player stats:', error);
    }
  });