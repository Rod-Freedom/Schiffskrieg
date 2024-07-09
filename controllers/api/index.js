const router = require('express').Router();
const playerRoutes = require('./playerRoutes');
const matchRoutes = require('./matchRoutes');
// const shotRoutes = require('./shotRoutes');

router.use('/players', playerRoutes);
router.use('/matches', matchRoutes);
// router.use('/shots', shotRoutes);

module.exports = router;
