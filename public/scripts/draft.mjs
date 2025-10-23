const playerList = document.querySelector('#playerList');
const teamList = document.querySelector('#teamList');
const defaultTeamId = 111;
const lsTeamId = ''; // store team id from login in local storage

// Populate draft list
try {
  const response = await fetch('/draftplayers');
  const players = await response.json();
  console.log(players);

  players.sort((a, b) => a.rank - b.rank);

  playerList.innerHTML = '';

  // Return player list in button form
  players.forEach((item) => {
    console.log(item)
    const li = document.createElement('li');
    const button = document.createElement('button');
    button.textContent = `${item.rank} ${item.firstName} ${item.lastName}  ${item.position}`;
    li.append(button);
    playerList.appendChild(li);

    button.onclick = async () => {
      const confirmSelection = confirm(
        `You have selected ${item.firstName} ${item.lastName}. Click OK to confirm selection.`
      );
      if (!confirmSelection) return;

      try {
        // Prompt for team ID (or fallback to local storage or default)
        let teamId = prompt('Please enter team id:') || lsTeamId || defaultTeamId;

        // Optional: call getTeam(teamId) if needed
        // const team = getTeam(teamId);

        // Update database
        const updateResponse = await fetch(`/draftplayers/${item._id}`, {
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

        // Disable or remove drafted player
        button.disabled = true;
        button.textContent = `${updated.firstName} ${updated.lastName} (Drafted)`;
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



// function getTeam(teamid) {
//     teams.forEach(item => {
//         if (teamid == item.id)
//             team = item.name
//         return team
//     })};

// const fgm = document.getElementById("fgm");

// teams.forEach(item => {
//     const option = document.createElement('option');
//     option.textContent = item.name;
//     fgm.appendChild(option);
// });


// const teamDropdown = document.getElementById('fgm');
// const pickTableBody = document.getElementById('pickTableBody');

// // Populate dropdown options for each team
// teams.forEach(team => {
//     const option = document.createElement('option');
//     option.value = team.name;
//     option.textContent = team.name;
//     teamDropdown.appendChild(option);
// });

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

// // Event Listener for Dropdown Selection
// teamDropdown.addEventListener('change', () => {
//     const selectedTeam = teamDropdown.value;
//     displayFilteredPicks(selectedTeam);
// });