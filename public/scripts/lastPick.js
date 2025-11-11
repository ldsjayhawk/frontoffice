export default async function getLastPick() {
  try {
    const response = await fetch('/draftplayers');
    if (!response.ok) throw new Error('Failed to fetch drafted players');
    
    const players = await response.json();

    // Filter out players without pickTime
    const pickedPlayers = players.filter(p => p.pickTime);

    const otc = document.querySelector('#otc');


    if (pickedPlayers.length === 0) {
      otc.textContent = 'No picks have been made yet.';
      return;
    }

    // Find the player with the most recent pickTime
    const lastPick = pickedPlayers.reduce((latest, player) =>
      new Date(player.pickTime) > new Date(latest.pickTime) ? player : latest
    );

    const formatted = new Date(lastPick.pickTime).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

    otc.textContent = `Last pick: ${lastPick.firstName} ${lastPick.lastName} at ${formatted} by ${lastPick.fgm_team}`;

  } catch (error) {
    console.error('Error fetching last pick:', error);
    alert('Error retrieving last pick. Please try again.');
  }
}
