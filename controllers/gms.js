const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAllGms = async (req, res) => {
    //#swagger.tags=['gms']
    const result = await mongodb.getDb().collection('fgm_gms').find();
    
    return result.toArray();

}

const getGm = async (req, res) => {
    //#swagger.tags=['gms']
    const gmId = new ObjectId(req.params.id)
    const result = await mongodb.getDb().collection('fgm_gms').findOne({_id: gmId});

    console.log(result)

    return result;
};

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

module.exports = { getAllGms, getGm, addGm, updateGm, deleteGm }