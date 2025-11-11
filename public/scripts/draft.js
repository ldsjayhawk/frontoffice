import getTeamList from './teamList.js';
import getLastPick from './lastPick.js';


const playerList = document.querySelector('#playerList');
const teamList = document.querySelector('#teamList');
const otc = document.querySelector('#otc');
let fgm_team = null;

// Populate draft list
async function getPlayerList() {
  try {
    // Retrieve player list for the draft
    const response = await fetch('/draftplayers');
    if (!response.ok) throw new Error(`Failed to fetch players: ${response.status}`);

    const players = await response.json();

    // Sort players by rank
    players.sort((a, b) => a.rank - b.rank);

    const playerList = document.querySelector('#playerList');
    if (!playerList) {
      console.error('No #playerList element found.');
      return;
    }

    playerList.innerHTML = ''; // Clear previous list

    // Loop through players and create buttons
    players.forEach(player => {
      const li = document.createElement('li');
      const button = document.createElement('button');

      if (player.fgm_team) {
        // Player already drafted — disable button
        button.style.backgroundColor = '#999';
        button.style.color = '#fff';
        button.disabled = true;
        button.textContent = `${player.rank} ${player.firstName} ${player.lastName} ${player.position} - Drafted by ${player.fgm_team}`;
      } else {
        // Player available — make selectable button
        button.textContent = `${player.rank} ${player.firstName} ${player.lastName} ${player.position}`;
        button.classList.add('draft-button');
        button.dataset.id = player._id;
        button.dataset.firstName = player.firstName;
        button.dataset.lastName = player.lastName;
      }

      li.appendChild(button);
      playerList.appendChild(li);
    });

  } catch (error) {
    console.error('Error loading players:', error);
  }
  getLastPick();
}


async function handleDraftButtonClick(event){
  // save team and draft date/time in db when drafted
  if (!event.target.classList.contains('draft-button')) return;

  const button = event.target;
  // dataset property set earlier is `id` (button.dataset.id = player._id)
  // reading the wrong property (`_id`) caused `playerId` to be undefined
  // which resulted in a request like `/draftplayers/undefined/team` and
  // Mongo's ObjectId constructor throwing a BSONError.
  const playerId = button.dataset.id || button.dataset._id;
  const firstName = button.dataset.firstName;
  const lastName = button.dataset.lastName;
  const pickTime = new Date();

  console.log(`fgm team: ${fgm_team}`)
  const confirmSelection = confirm(
    `You have selected ${firstName} ${lastName}. Click OK to confirm selection.`
  );
  if (!confirmSelection) return;

  try {
    const updateResponse = await fetch(`/draftplayers/${playerId}/team`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fgm_team, pickTime }),
    });

    if (!updateResponse.ok) throw new Error(`Failed to add player`);

    await getPlayerList();
    if (fgm_team) {
      await getTeamList(fgm_team);
    }

  } catch (error) {
    console.error(error);
    alert('Error updating player. Please try again.');
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  getLastPick();
  fgm_team = await checkUser();

  await getPlayerList();
  if (fgm_team) {
    await getTeamList(fgm_team);
  }

  playerList.addEventListener('click', handleDraftButtonClick);

});

async function checkUser() {
  let user = prompt('Enter your ProFSL profile #:')
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