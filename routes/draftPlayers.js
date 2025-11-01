const express = require('express');
const router = express.Router();

const validate = require('../utilities/validation');
const asyncHandler = require('../utilities/asyncHandler');
const draftPlayersController = require('../controllers/draftPlayers');
const { isAuthenticated } = require('../utilities/authenticate');

router.get('/',
    asyncHandler(async(req, res) => {
        const result = await draftPlayersController.getAll(req, res);

        if (!result) {
            const error = new Error('Error retrieving players. Please try again.')
            error.status = 500;
            throw error;
        }

        res.status(200).json(result);
    })
);

router.get('/team/:teamId', 
    // validate.teamValidationRules(), //remove upon adding authentication
    // validate.checkTeam, //remove upon adding authentication
    asyncHandler(async(req, res) => {
        const result = await draftPlayersController.getPlayersByTeam(req, res);

        if (!result) {
            const error = new Error('Error retrieving player. Please try again.')
            error.status = 500;
            throw error;
        }

    res.status(200).json(result);
    })
);

router.get('/:id', 
    validate.checkMongoId,
    asyncHandler(async(req, res) => {
        const result = await draftPlayersController.getDraftPlayer(req, res);

        if (!result) {
            const error = new Error('Error retrieving player. Please try again.')
            error.status = 500;
            throw error;
        }

    res.status(200).json(result);
    })
);

router.post('/', 
    isAuthenticated,
    validate.draftPlayerValidationRules(),
    validate.checkDraftPlayer,
    asyncHandler(async(req, res) => {
        const result = await draftPlayersController.addDraftPlayer(req, res);
        
        if (result != true) {
            const error = new Error('Error occurred while adding player.  Please try again.')
            error.status = 500;
            throw error;
        }
        res.status(201).json(result);
    })
);

router.put('/:id/team',
    //isAuthenticated,
    asyncHandler(draftPlayersController.updateDraftPlayer));


router.delete('/:id',
    isAuthenticated,
    validate.checkMongoId,
    asyncHandler(async(req, res) => {
        const result = await draftPlayersController.deleteDraftPlayer(req, res);

        if (result < 1) {
            const error = new Error('Error occurred while deleting player.  Please try again.')
            error.status = 500;
            throw error;
        }

        res.status(204).json('Player deleted');   
    })
)

module.exports = router;