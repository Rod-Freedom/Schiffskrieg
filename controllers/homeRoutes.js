const router = require('express').Router();
const { Player } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
  try {

    const playerData = await Player.findOne({ where: { player_id: req.session.player_id } });

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
  console.log(req)
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

router.get('/game', withAuth, (req, res) => {
  res.render('game.handlebars', {
    logged_in: req.session.logged_in,
  });
});

router.get('/signup', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  } else {
    res.render('signup');
  }
});

router.get('/profile', withAuth, (req, res) => {
  res.render('profile.handlebars', {
    logged_in: req.session.logged_in,
  });
});


module.exports = router;
