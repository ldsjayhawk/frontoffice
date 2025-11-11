export default async function getTeamList(teamId) {
  try {
    if (!teamId) {
      console.log('No team ID provided');
      return;
    }
    const response = await fetch(`/draftplayers/team/${teamId}`);
    const teamPlayers = await response.json();

    teamPlayers.sort((a, b) => a.rank - b.rank);
    const teamListElement = document.querySelector('#teamList');
    teamListElement.innerHTML = ''; // clear previous list

    teamPlayers.forEach(player => {
      const li = document.createElement('li');
      li.textContent = `${player.rank} ${player.firstName} ${player.lastName} ${player.position}`;
      teamListElement.appendChild(li);
    });

    return teamListElement

  } catch (error) {
    console.error('Error fetching team players:', error);
  }
}