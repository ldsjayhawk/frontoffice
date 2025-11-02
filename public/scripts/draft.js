const playerList = document.querySelector('#playerList');
const teamList = document.querySelector('#teamList');
const otc = document.querySelector('#otc');
let lsPickTime;
let lsTeamId;
let teamId;

const fgm_team = await checkUser();
localStorage.setItem('lsTeamId', fgm_team)

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
        const pickTime = Date.now()
        localStorage.setItem('lsPickTime', pickTime)
        console.log(`fgm team: ${fgm_team}`)
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
    const teamId = localStorage.getItem('lsTeamId')
    const response = await fetch(`/draftplayers/team/${teamId}`);
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

  async function checkUser() {
      let user = prompt('Enter your ProFSL profile id:')
      console.log(user)
      if (!user) return null

      try{
          const response = await fetch(`/gms/${user}`);
      

          if (!response.ok) {
              throw new Error(`User not found ${response.status}`);
          }
          
          const gm = await response.json();
          console.log(`teamCode: ${gm.teamCode}`)
          return gm.teamCode

      } catch (error) {
          console.error('Error getting user', error)
          return null
      }
  }

  
const otcTime = localStorage.getItem('lsPickTime');
if (otcTime) {
  const otcDate = new Date(Number(otcTime)); // convert string to number
  const options = {  
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true};
  const formattedOtcDate = otcDate.toLocaleDateString(undefined, options);
  otc.textContent = `Last pick made at ${formattedOtcDate}`;
} else {
  otc.textContent = "No pick made yet";
}
