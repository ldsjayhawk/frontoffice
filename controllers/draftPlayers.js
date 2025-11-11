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

const getLastPick = async (req, res) => {
    //#swagger.tags=['draftPlayers']
    try {
        const result = await mongodb.getDb().collection('fgm_draft_players').findOne(
            { fgm_team: { $exists: true, $ne: null }, pickTime: { $exists: true, $ne: null } },
            { sort: { pickTime: -1 } }
        );
        return result;
    } catch (error) {
        console.error('Error getting last pick:', error);
        return null;
    }
}

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
  try {
        const idParam = req.params.id;

        // Validate the id before creating an ObjectId to avoid BSONError
        if (!ObjectId.isValid(idParam)) {
            return res.status(400).json({ message: 'Invalid id' });
        }

        const id = new ObjectId(idParam);
        const { fgm_team, pickTime } = req.body;
        console.log('Body received:', req.body);

        // Use updateOne for a clear update result, then fetch the updated document.
        const updateResult = await mongodb.getDb().collection('fgm_draft_players').updateOne(
            { _id: id },
            { $set: { fgm_team, pickTime } }
        );

        console.log('Update result:', updateResult);

        if (!updateResult || updateResult.matchedCount === 0) {
            // No document matched the filter
            return res.status(404).json({ message: 'Player not found' });
        }

        // Get the updated document to return
        const updatedDoc = await mongodb.getDb().collection('fgm_draft_players').findOne({ _id: id });

        return res.status(200).json(updatedDoc);

  } catch (error) {
    console.error('Error updating player:', error);
    res.status(500).json({message: 'Server error'});
  }
}


const deleteDraftPlayer = async (req,res) => {
    //#swagger.tags=['draftPlayers']
    const draftPlayerId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().collection('fgm_draft_players').deleteOne({ _id: draftPlayerId });
    
    return response.deletedCount
}

    module.exports = {getAll, getDraftPlayer, getPlayersByTeam, getLastPick, addDraftPlayer, updateDraftPlayer, deleteDraftPlayer}