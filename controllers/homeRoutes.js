const router = require('express').Router();
const { Player, Match } = require('../models');
const withAuth = require('../utils/auth');
const sequelize = require('sequelize');

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


router.get('/profile', withAuth, async (req, res) => {
  try {
    const player = req.session.player_id;
    const nickname = req.session.nickname;

    const victoryCount = await Match.count({
      where: { winner_id: player }
    });

    const matchesPlayed = await Match.count({
      where: {
        [sequelize.Op.or]: [{ player_1_id: player }, { player_2_id: player }]
      }
    });

    const defeatCount = matchesPlayed - victoryCount;

    // Placeholder values for other stats
    const weakPoint = "A1"; // Replace with actual calculation
    const nemesis_id = await Match.findAll({
      attributes: [
        [sequelize.literal('COUNT(*)'), 'wins_count'],
        [sequelize.literal(`CASE WHEN "player_1_id" = ${player} THEN "player_2_id" ELSE "player_1_id" END`), 'opponent_id']
      ],
      where: {
        [sequelize.Op.or]: [
          { player_1_id: player },
          { player_2_id: player }
        ],
        winner_id: {
          [sequelize.Op.not]: player
        }
      },
      group: ['opponent_id'],
      order: [[sequelize.literal('wins_count'), 'DESC']],
      limit: 1,
      raw: true
    });

    if (nemesis_id.length > 0) {
      const opponentId = nemesis_id[0].opponent_id;

      const nemesis = await Player.findByPk(opponentId);
      nemesis_id[0].opponent  = nemesis ? nemesis.nickname : null;
    }

    console.log(nemesis_id)
    const avgHitsPerMatch = 5; // Replace with actual calculation
    const avgFailuresPerMatch = 2; // Replace with actual calculation
    const avgFailuresBeforeFirstHit = 1; // Replace with actual calculation

    res.render('profile.handlebars',{
      nickname,
      victoryCount,
      matchesPlayed,
      defeatCount,
      weakPoint,
      nemesis : nemesis_id[0].opponent,
      avgHitsPerMatch,
      avgFailuresPerMatch,
      avgFailuresBeforeFirstHit
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
