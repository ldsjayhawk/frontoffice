const express = require('express');
const router = express.Router();
const rosterController = require('../controllers/rosters')

router.get('/', rosterController.getAllRosters);
router.get('/teamRoster', rosterController.getTeamRoster);
// router.get('/:teamcode', rosterController.getRoster);

// router.post('/', rosterController.addTeam)
// router.put('/:teamcode', rosterController.updateTeam)
// router.delete('/:teamcode', rosterController.deleteTeam)

module.exports = router;