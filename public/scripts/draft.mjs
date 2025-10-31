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


// Populate draft list
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



        // // Update UI
        // button.textContent = `${updated.rank} ${updated.firstName} ${updated.lastName} ${updated.position} - Drafted by ${updated.fgm_team}`;
        // button.style.backgroundColor = '#999';
        // button.style.color = '#fff';

        // const teamLi = document.createElement('li');
        // teamLi.textContent = `${updated.firstName} ${updated.lastName} (Team ${lsTeamId})`;
        // teamList.appendChild(teamLi);

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

// Populate team list
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



// // Function to Display Filtered Results in Table
// function displayFilteredPicks(filterTeam) {
//     pickTableBody.innerHTML = ''; // Clear the table body

//     const filteredPicks = picks.filter(pick => 
//         filterTeam === "" || pick.team === filterTeam
//     );

//     // Add a row for each filtered pick
//     filteredPicks.forEach(pick => {
//         const row = document.createElement('tr');

//         // Create table cells for each property
//         const overallCell = document.createElement('td');
//         overallCell.textContent = pick.overall;
//         row.appendChild(overallCell);

//         const pickCell = document.createElement('td');
//         pickCell.textContent = pick.pick;
//         row.appendChild(pickCell);

//         const teamCell = document.createElement('td');
//         teamCell.textContent = pick.team;
//         row.appendChild(teamCell);

//         const playerCell = document.createElement('td');
//         playerCell.textContent = pick.player || " "; // Display "N/A" if player is empty
//         row.appendChild(playerCell);

//         pickTableBody.appendChild(row);
//     });
// }

// // Initial Display of All Picks
// displayFilteredPicks(""); // Show all picks on page load
