const router = require('express').Router();
const { Player } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
  try {
    const playerData = await Player.findOne({ where: { name: req.session.player_name } });

    const player = playerData.get({ plain: true });

    res.render('homepage', {
      player,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

router.get('/game', withAuth, async (req, res) => {
  try {
    const playerData = await Player.findOne({ where: { name: req.session.player_name } });

    const player = playerData.get({ plain: true });

    res.render('game.handlebars', {
      player,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
