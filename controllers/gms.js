const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAllGms = async (req, res) => {
    //#swagger.tags=['gms']
    const result = await mongodb.getDb().collection('fgm_gms').find();
    
    return result.toArray();

}

const getGmTeam = async (req, res) => {
    //#swagger.tags=['gms']
    try {
        const { gmNumber } = req.params
        const gm = Number(gmNumber)
        const result = await mongodb
            .getDb()
            .collection('fgm_gms')
            .findOne(
                {gmNumber: gm},
                {projection: {teamCode: 1, _id: 0}}
            )

        if (!result) {
            return res.status(404).json({message: 'User not found'})
        }
        console.log(result)
        return res.status(200).json(result);
    
    } catch (error) {
        console.error('Error returning GM', error);
        res.status(500).json({message: 'Server error'});
    }
}


const addGm = async (req,res) => {
    //#swagger.tags=['gms']
    const current = req.body.current !== undefined ? Number(req.body.current):undefined;
    const gmNumber = req.body.gmNumber !== undefined ? Number(req.body.gmNumber):undefined;
    const gm = {
        gmName: req.body.gmName,
        gmNumber: gmNumber,
        profslId: req.body.profslId,
        fantraxId: req.body.fantraxId,
        teamCode: req.body.teamCode,
        joinDate: req.body.joinDate,
        current: current
    };

    const response = await mongodb.getDb().collection('fgm_gms').insertOne(gm);
    console.log(response)
    return response.acknowledged
}


const updateGm = async (req,res) => {
    //#swagger.tags=['gms']
    console.log('Body:', req.body);

    const gmId = new ObjectId(req.params.id);
    const gm = {
        gmName: req.body.gmName,
        gmNumber: req.body.gmNumber,
        profslId: req.body.profslId,
        fantraxId: req.body.fantraxId,
        teamCode: req.body.teamCode,
        joinDate: req.body.joinDate,
        current: req.body.current
    };

    const response = await mongodb.getDb().collection('fgm_gms').replaceOne({ _id: gmId }, gm);
    return response.modifiedCount
};


const deleteGm = async (req,res) => {
    //#swagger.tags=['gms']
    const gmId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().collection('fgm_gms').deleteOne({ _id: gmId });
    
    return response.deletedCount
}

module.exports = { getAllGms, getGmTeam, addGm, updateGm, deleteGm }