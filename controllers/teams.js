const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAllTeams = async (req, res) => {
    //#swagger.tags=['teams']
    const result = await mongodb.getDb().collection('fgm_teams').find();
    result.toArray().then((teams) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(teams);
    }); //.catch(err);
}

const getTeam = async (req, res) => {
    //#swagger.tags=['teams']
    const teamId = new ObjectId(req.params.id)
    const result = await mongodb.getDb().collection('fgm_teams').find({_id: teamId});
    result.toArray().then((teams) => {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(teams[0]);
    }); //.catch(err);
};

// const addPlayer = async (req,res) => {
//     //#swagger.tags=['teams']
//     const player = {
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         email: req.body.email,
//         favoriteColor: req.body.favoriteColor,
//         birthday: req.body.birthday
//     };

//     const response = await mongodb.getDb().collection('fgm_draft_teams').insertOne(player);
//     if (response.acknowledged) {
//         res.status(204).send();
//     } else {
//         res.status(500).json(response.error || 'Error occurred while adding player');
//     }
// }


const updateTeam = async (req,res) => {
    //#swagger.tags=['teams']
    console.log('Body:', req.body);

    const teamId = new ObjectId(req.params.id);
    const team = {
        team: req.body.team,
        teamCode: req.body.teamCode,
        gmNumber: req.body.gmNumber,
        backColor: req.body.backColor,
        foreColor: req.body.foreColor
    };

    const response = await mongodb.getDb().collection('fgm_teams').replaceOne({ _id: teamId }, team);
    if (response.modifiedCount > 0) {
        res.status(204).send();
    } else {
        res.status(500).json(response.error || 'Error occurred while updating player');
    }
}

// const deleteTeam = async (req,res) => {
//     //#swagger.tags=['teams']
//     const playerId = new ObjectId(req.params.id);
//     const response = await mongodb.getDb().collection('fgm_draft_teams').deleteOne({ _id: teamId });
//     if (response.deletedCount > 0) {
//         res.status(204).send();
//     } else {
//         res.status(500).json(response.error || 'Error occurred while deleting player');
//     }
// }

module.exports = { getAllTeams, getTeam, updateTeam }