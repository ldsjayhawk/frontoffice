// const mongodb = require('../db/connect');
// const ObjectId = require('mongodb').ObjectId;

const utilities = require("../utilities/")
const leagueId = 'xw3axvujmv78yxlg';
const rosterUrl = `https://www.fantrax.com/fxea/general/getTeamRosters?leagueId=${leagueId}`;
const playerUrl = 'https://www.fantrax.com/fxea/general/getPlayerIds?sport=MLB'

const options = {
    method: 'GET',
    headers: {
        'User-Agent': 'FSL/1.0'
    }
};

const getAllRosters = async(req, res) => {
    const response = await fetch(rosterUrl,options);
    
    if (response.ok) {
        const data = await response.json();
        let nav = await utilities.getNav()
        res.render('rosters/rosters', { 
            rosters:data, 
            loggedin: false,
            accountData: {},
            nav,
            pageCSS: 'rosters.css'
        });
        // res.status(200).json(data);

    } else {
        res.status(500).json(response.error || 'Error occurred while attempting to get rosters');
    }
};

module.exports = { getAllRosters }