const router = require('express').Router();
const { Player } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
  try {
    console.log('hello world');
    console.log(req.session);
    const playerData = await Player.findOne({ where: { player_id: req.session.player_id } });

    const player = playerData.get({ plain: true });

    console.log(playerData);
    console.log(player);
    res.render('homepage', {
      player,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  console.log(req)
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

router.get('/signup', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }else{
    res.render('signup');
  }
});

module.exports = router;
