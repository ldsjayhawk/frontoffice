const express = require('express');
const router = express.Router();
const teamsController = require('../controllers/teams')

router.get('/', teamsController.getAllTeams);
router.get('/:id', teamsController.getTeam);

// router.post('/', teamsController.addTeam)
// router.put('/:id', teamsController.updateTeam)
// router.delete('/:id', teamsController.deleteTeam)

module.exports = router;