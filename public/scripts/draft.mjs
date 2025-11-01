const playerList = document.querySelector('#playerList');
const teamList = document.querySelector('#teamList');
const teamSelections = document.querySelector('#teamSelections')
// const lsTeamId = localStorage.getItem() <-- need item to get in parenthesis
const lsTeamId = 'KC';

// try
//   const teamID = lsTeamId
//   const updateResponse = await fetch(`/teams/${team._id}`, {
//    teamSelections.textContent = `${lsTeamId}`
//   }

getPlayerList();
getTeamList();

// Populate draft list
async function getPlayerList() {
  try {
    const response = await fetch('/draftplayers');
    const players = await response.json();

    players.sort((a, b) => a.rank - b.rank);
    playerList.innerHTML = ''; // clear list


    players.forEach(player => {
      const li = document.createElement('li');
      const button = document.createElement('button');

      if (player.fgm_team) {
        button.style.backgroundColor = '#999';
        button.style.color = '#fff';
        button.disabled = true;
        button.textContent = `${player.rank} ${player.firstName} ${player.lastName} ${player.position} - Drafted by ${player.fgm_team}`;
      } else {
        button.textContent = `${player.rank} ${player.firstName} ${player.lastName} ${player.position}`;
      }

      li.appendChild(button);
      playerList.appendChild(li);

      // save fgm team in db when drafted
      button.onclick = async () => {
        const fgm_team = lsTeamId.toUpperCase()
        const confirmSelection = confirm(
          `You have selected ${player.firstName} ${player.lastName}. Click OK to confirm selection.`
        );
        if (!confirmSelection) return;

        try {
          const updateResponse = await fetch(`/draftplayers/${player._id}/team`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fgm_team }),
          });

        console.log('Updated result:', updateResponse);
          if (!updateResponse.ok) {
            throw new Error(`Failed to add player`);
          }

        getPlayerList();
        getTeamList();

      } catch (error) {
        console.error(error);
        alert('Error updating player. Please try again.');
      }
    };
  });

} catch (error) {
  console.error('Error fetching players:', error);
  alert('Error retrieving players. Please try again.');
}
}

// Populate team list
async function getTeamList() {
  try {
    const response = await fetch(`/draftplayers/team/${lsTeamId}`);
    const teamPlayers = await response.json();

    teamPlayers.sort((a, b) => a.rank - b.rank);
    teamList.innerHTML = ''; // clear previous list

    teamPlayers.forEach(player => {
      const li = document.createElement('li');
      li.textContent = `${player.rank} ${player.firstName} ${player.lastName} ${player.position}`;
      teamList.appendChild(li);
    });

  } catch (error) {
    console.error('Error fetching team players:', error);
    alert('Error retrieving players. Please try again.');
  }
}