const playerList = document.querySelector('#playerList');
const teamList = document.querySelector('#teamList');
let teamId = 'KC';
let lsTeamId; // store team id from login in local storage

// Populate draft list
try {
  const response = await fetch('/draftplayers');
  const players = await response.json();

  players.sort((a, b) => a.rank - b.rank); // sort players by rank

  playerList.innerHTML = ''; // initialize player list

  // Return player list in button form
  players.forEach((player) => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.textContent = `${player.rank} ${player.firstName} ${player.lastName}  ${player.position}`;
    li.append(button);
    playerList.appendChild(li);

    button.onclick = async () => {
      const confirmSelection = confirm(
        `You have selected ${player.firstName} ${player.lastName}. Click OK to confirm selection.`
      );
      if (!confirmSelection) return;

      try {
        const updateResponse = await fetch(`/draftplayers/${player._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teamId }),
        });

        if (!updateResponse.ok) {
          throw new Error('Failed to add player to team');
        }

        const updated = await updateResponse.json();
        console.log(`${updated.firstName} ${updated.lastName} added to team ${teamId}`);

        // Update UI
        const teamLi = document.createElement('li');
        teamLi.textContent = `${updated.firstName} ${updated.lastName} (Team ${teamId})`;
        teamList.appendChild(teamLi);

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
  teamId = teamId.toUpperCase()
  const response = await fetch(`/draftplayers/team/${teamId}`);
  const players = await response.json();

  players.sort((a, b) => a.rank - b.rank);

players.forEach((player) => {
    const li = document.createElement('li');
    li.textContent = `${player.rank} ${player.firstName} ${player.lastName}  ${player.position}`;
    teamList.appendChild(li);
});

} catch (error) {
  console.error('Error fetching players:', error);
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
