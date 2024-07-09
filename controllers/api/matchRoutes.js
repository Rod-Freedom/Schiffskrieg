const router = require('express').Router();
const { Match } = require('../../models');
const sequelize = require('sequelize');

router.get('/:id', async (req, res) => {
    try {
        const matchData = await Match.findOne({ where: { match_id: req.params.id } });
        const match = matchData.get({ plain: true });
        res.status(200).json(match);
    } catch (err) {
        res.status(500).json(err);
    }
})

// Show the last 20 matches played by queried player
router.get('/player/:id', async (req, res) => {
    try {
        const matchData = await Match.findAll({
            where: {
                [sequelize.Op.or]: [{ player_1_id: req.params.id }, { player_2_id: req.params.id }]
            },
            limit: 20
        });
        const matches = matchData.map((match) => match.get({ plain: true }));
        res.status(200).json(matches);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/', async (req, res) => {
    try {
        const matchData = await Match.create(req.body);
        const match = matchData.get({ plain: true });
        res.status(200).json(match);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;