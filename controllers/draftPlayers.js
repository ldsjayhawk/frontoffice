const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['draftPlayers']
    const result = await mongodb.getDb().collection('fgm_draft_players').find();

    return result.toArray();
}

const getDraftPlayer = async (req, res) => {
    //#swagger.tags=['draftPlayers']
    const draftPlayerId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().collection('fgm_draft_players').findOne({_id: draftPlayerId});
    console.log(result)
    return result;
};

const addDraftPlayer = async (req,res) => {
    //#swagger.tags=['draftPlayers']
    const rank = req.body.rank ? Number(req.body.rank):undefined;
    const draftPlayer = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        position: req.body.position,
        rank: rank,
        fgm_team: req.body.fgm_team
    };
    
    const response = await mongodb.getDb().collection('fgm_draft_players').insertOne(draftPlayer);
    return response.acknowledged
}


const updateDraftPlayer = async (req,res) => {
    //#swagger.tags=['draftPlayers']
    console.log('Body:', req.body);

    const draftPlayerId = new ObjectId(req.params.id);
    const draftPlayer = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        position: req.body.position,
        rank: req.body.rank,
        fgm_team: req.body.fgm_team
    };

    const response = await mongodb.getDb().collection('fgm_draft_players').replaceOne({ _id: draftPlayerId }, draftPlayer);
    return response.modifiedCount
}

const deleteDraftPlayer = async (req,res) => {
    //#swagger.tags=['draftPlayers']
    const draftPlayerId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().collection('fgm_draft_players').deleteOne({ _id: draftPlayerId });
    
    return response.deletedCount
}

module.exports = {getAll, getDraftPlayer, addDraftPlayer, updateDraftPlayer, deleteDraftPlayer}