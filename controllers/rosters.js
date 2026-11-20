// const mongodb = require('../db/connect');
// const ObjectId = require('mongodb').ObjectId;

const utilities = require("../utilities/")
const leagueId = 'xw3axvujmv78yxlg';
const rosterUrl = `https://www.fantrax.com/fxea/general/getTeamRosters?leagueId=${leagueId}`;
// const playerUrl = 'https://www.fantrax.com/fxea/general/getAdp?sport=MLB'
const playerUrl = 'https://www.fantrax.com/fxea/general/getPlayerIds?sport=MLB'

// url = "https://www.fantrax.com/fxea/general/getPlayerIds"
// params = {"sport": "NFL"}
// headers = {"User-Agent": "Mozilla/5.0"}

const options = {
    method: 'GET',
    headers: {
        'User-Agent': 'FSL/1.0'
    }
};

const getAllRosters = async(req, res) => {
    const rosterResponse = await fetch(rosterUrl,options);
    const playerResponse = await fetch(playerUrl,options);
    
    if (rosterResponse.ok && playerResponse.ok) {
        const rosterData = await rosterResponse.json();
        const playerData = await playerResponse.json();
        let nav = await utilities.getNav()
        res.render('rosters/rosters', { 
            rosters:rosterData, 
            players:playerData,
            loggedin: false,
            accountData: {},
            nav,
            pageCSS: 'rosters.css'
        });

    } else {
        res.status(500).json('Error occurred while attempting to get rosters');
    }
};

const getTeamRoster = async(req, res) => {
    console.log("Starting Fantrax requests");
    console.log("getTeamRoster controller reached");
    const teamResponse = await fetch(rosterUrl,options);
    const playerResponse = await fetch(playerUrl,options);
    const positionOrder = ['C', 'CI', 'MI', 'OF', 'SP', 'RP'];
    
    if (teamResponse.ok && playerResponse.ok) {
        const teamData = await teamResponse.json();
        const playerData = await playerResponse.json();
        const teamId = 'i4bb2chomv78yxsd'  

        
        const team = teamData.rosters[teamId]
        let nav = await utilities.getNav()
        
        const mlbPlayers = team.rosterItems.filter(item => item.status.toLowerCase() === "active" || item.status.toLowerCase() === "reserve");
        const minorPlayers =  team.rosterItems.filter(item => item.status.toLowerCase() === "minors");
        console.log(mlbPlayers)
        console.log(minorPlayers)

        mlbPlayers.sort((a,b) => positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position));
        minorPlayers.sort((a,b) => positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position));


        // users.sort((a, b) => a.age - b.age);

        res.render('rosters/teamRoster', { 
            team:team, 
            players:playerData,
            mlbPlayers:mlbPlayers,
            minorPlayers:minorPlayers,
            loggedin: false,
            accountData: {},
            nav,
            pageCSS: 'rosters.css'
        })
    }
}

function getProperName(playerName){
    const playerParsed = playerName.split(',')
    const playerFirstName = playerParsed[1].trim()
    const playerLastName = playerParsed[0].trim()

    return (`${playerFirstName} ${playerLastName}`)
}

module.exports = { getAllRosters, getTeamRoster }