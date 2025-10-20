const express = require('express');
const router = express.Router();
const draftPlayersRouter = require('./draftPlayers');
const gmsRouter = require('./gms');
// const teamsRouter = require('./teams');
const swaggerRouter = require('./swagger');
// const passport = require('passport')


// router.use('/');
router.use('/', swaggerRouter);
router.use('/draftPlayers', draftPlayersRouter);
router.use('/gms', gmsRouter);
// router.use('/teams', teamsRouter);


module.exports = router;