const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['draftPlayers']
    const result = await mongodb.getDb().collection('fgm_draft_players').find();

    return result.toArray();
}

const getPlayersByTeam = async (req, res) => {
    const teamId = req.params.teamId;
    const result = await mongodb.getDb().collection('fgm_draft_players').find({fgm_team : teamId });
    return result.toArray();
}

const getDraftPlayer = async (req, res) => {
    //#swagger.tags=['draftPlayers']
    const draftPlayerId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().collection('fgm_draft_players').findOne({_id: draftPlayerId});
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



const updateDraftPlayer = async (req, res) => {
  //#swagger.tags=['draftPlayers']
  // try {
    const id = new ObjectId(req.params.id);
    const {fgm_team} = req.body;
    console.log('Body received:', req.body);


    const result = await mongodb.getDb().collection('fgm_draft_players').findOneAndUpdate(
        { _id: id },
        { $set: { fgm_team } },
        { returnDocument: 'after' }
    );

    console.log('Mongo result:', result.fgm_team);
    if (result.fgm_team === null) {
        return res.status(500).json({ message: 'Failed to update player' });
        
    } else { res.status(200).json(result.value)}; // send the updated player}
};


const deleteDraftPlayer = async (req,res) => {
    //#swagger.tags=['draftPlayers']
    const draftPlayerId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().collection('fgm_draft_players').deleteOne({ _id: draftPlayerId });
    
    return response.deletedCount
}

module.exports = {getAll, getDraftPlayer, getPlayersByTeam, addDraftPlayer, updateDraftPlayer, deleteDraftPlayer}