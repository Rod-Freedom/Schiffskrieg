const router = require('express').Router();
const { Player, Match, Shot } = require('../models');
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
    const nickname = await Player.findOne({
      attributes:['nickname'],
      where: { player_id: player }
    });

    const victoryCount = await Match.count({
      where: { winner_id: player }
    });

    const matchesPlayed = await Match.count({
      where: {
        [sequelize.Op.or]: [{ player_1_id: player }, { player_2_id: player }]
      }
    });

    const defeatCount = matchesPlayed - victoryCount;


    // retrieve the oppponent that has win most times to the user
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
 
    // retrieve the coordinate with most hits by all the oponents of the user
    const weakPoint = await Shot.findAll({
      attributes: [
        'coordinate',
        [sequelize.fn('COUNT', sequelize.col('coordinate')), 'hit_count']
      ],
      include: [{
        model: Match,
        where: {
          [sequelize.Op.or]: [
            { player_1_id: player },
            { player_2_id: player }
          ]
        },
        attributes: [],
        required: true
      }],
      where: {
        shooter_id: {
          [sequelize.Op.ne]: player
        },
        result: 'Hit'
      },
      group: ['coordinate'],
      order: [[sequelize.literal('hit_count'), 'DESC']],
      limit: 1,
      raw: true
    });


    // Retrieve the average hits by each match for the user
    const avgHitsPerMatch = await Shot.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('shot.shot_id')), 'hits_per_match'],
      ],
      include: [
        {
          model: Match,
          attributes: [],
          where: {
            [sequelize.Op.or]: [
              { player_1_id: player },
              { player_2_id: player }
            ]
          }
        }
      ],
      where: {
        shooter_id: player,
        result: 'Hit'
      },
      raw: true
    });

    const avgMissPerMatch = await Shot.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('shot.shot_id')), 'miss_per_match'],
      ],
      include: [
        {
          model: Match,
          attributes: [],
          where: {
            [sequelize.Op.or]: [
              { player_1_id: player },
              { player_2_id: player }
            ]
          }
        }
      ],
      where: {
        shooter_id: player,
        result: 'Miss'
      },
      raw: true
    });


    // Retrieve all matches
    const allMatches = await Match.findAll({
      where: {
        [sequelize.Op.or]: [
          { player_1_id: player },
          { player_2_id: player }
        ]
      }
    });


    let totalMisses = 0;
    let matchesWithHits = 0;

    // For each match, retrieve the shots ordered by their sequence or timestamp
    for (const match of allMatches) {
      const shotsInEachMatch = await Shot.findAll({
        where: {
          match_id: match.match_id,
          shooter_id: player
        }
      });

       // Compute the number of misses before the first hit for each match
       let missesBeforeFirstHit = 0;
       let hitFound = false;
       for (const shot of shotsInEachMatch) {
         if (shot.result === 'Hit') {
           hitFound = true;
           break;
         } else if (shot.result === 'Miss') {
           missesBeforeFirstHit++;
         }
       };
 
       // If a hit was found, include this match in the average calculation
       if (hitFound) {
         totalMisses += missesBeforeFirstHit;
         matchesWithHits++;
       };
     };

     const avgFailuresBeforeFirstHit = matchesWithHits > 0 ? totalMisses / matchesWithHits : 0;

    res.render('profile.handlebars',{
      nickname : nickname.dataValues.nickname,
      victoryCount,
      matchesPlayed,
      defeatCount,
      weakPoint : weakPoint[0].coordinate,
      nemesis : nemesis_id[0].opponent,
      avgHitsPerMatch : avgHitsPerMatch[0].hits_per_match,
      avgFailuresPerMatch : avgMissPerMatch[0].miss_per_match,
      avgFailuresBeforeFirstHit
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
