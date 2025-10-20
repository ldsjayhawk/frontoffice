const express = require('express');
const router = express.Router();

const validate = require('../utilities/validation')
const asyncHandler = require('../utilities/asyncHandler');
const gmsController = require('../controllers/gms')
const { isAuthenticated } = require('../utilities/authenticate');

router.get('/',
    asyncHandler(async(req, res) => {
        const result = await gmsController.getAllGms(req, res);

        if (!result) {
            const error = new Error('Error retrieving GMs. Please try again.')
            error.status = 500;
            throw error;
        }

        res.status(200).json(result);
    })
);

router.get('/:id', 
    validate.checkMongoId,
    asyncHandler(async(req, res) => {
        const result = await gmsController.getGm(req, res);
        console.log(result)

        if (!result) {
            const error = new Error('Error retrieving GMs. Please try again.')
            error.status = 500;
            throw error;
        }

    res.status(200).json(result);
    })
);

router.post('/', 
    isAuthenticated,
    validate.gmValidationRules(),
    validate.checkGm,
    asyncHandler(async(req, res) => {
        const result = await gmsController.addGm(req, res);
        console.log(result)
        
        if (result != true) {
            const error = new Error('Error occurred while adding GM.  Please try again.')
            error.status = 500;
            throw error;
        }
        res.status(201).json(result);
    })
);

router.put('/:id',
    isAuthenticated,
    validate.checkMongoId,
    validate.gmValidationRules(),
    validate.checkGm,
    asyncHandler(async(req, res) => {
        const result = await gmsController.updateGm(req, res);

        if (result < 1) {
            const error = new Error('Error occurred while updating GM.  Please try again.')
            error.status = 500;
            throw error;
        }

        res.status(204).json('GM updated');   
    })
)

router.delete('/:id',
    isAuthenticated,
    validate.checkMongoId,
    asyncHandler(async(req, res) => {
        const result = await gmsController.deleteGm(req, res);
        console.log(result)


        if (result < 1) {
            const error = new Error('Error occurred while deleting GM.  Please try again.')
            error.status = 500;
            throw error;
        }

        res.status(204).json('GM deleted');   
    })
)

module.exports = router;