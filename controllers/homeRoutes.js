const router = require('express').Router();
const { Player, Match, Shot } = require('../models');
const withAuth = require('../utils/auth');
const sequelize = require('sequelize');

router.get('/', withAuth, async (req, res) => {
  try {

    const playerData = await Player.findOne({ where: { player_id: req.session.player_id } });

    const playerInfo = playerData.get({ plain: true });
    res.render('homepage', {
      playerInfo,
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

router.get('/game', withAuth, (req, res) => {
  res.render('game.handlebars', { 
    layout: false,
    logged_in: req.session.logged_in
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
    const playerData = await Player.findOne({
      where: { player_id: player }
    });

    const playerInfo = playerData.get({ plain: true });

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
    
    let nemesis = 'You have not been defeated' ;
    
    if (nemesis_id.length > 0) {
      const opponentId = nemesis_id[0].opponent_id;

      const nemesisInfo = await Player.findByPk(opponentId);
      nemesis_id[0].opponent = nemesisInfo ? nemesis.nickname : null;

      nemesis = nemesis_id[0].opponent;
    }

    let weakestPoint = '-';
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

    if (weakPoint.length > 0){
      weakestPoint = weakPoint[0].coordinate;
    };

    // Retrieve the average hits by each match for the user
    const hitsPerMatch = await Shot.findAll({
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

    const avgHitsPerMatch = matchesPlayed > 0 ? hitsPerMatch[0].hits_per_match / matchesPlayed : 0;

    const missPerMatch = await Shot.findAll({
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

    const avgFailuresPerMatch = matchesPlayed > 0 ? missPerMatch[0].miss_per_match / matchesPlayed : 0;


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

    res.render('profile.handlebars', {
      playerInfo,
      victoryCount,
      matchesPlayed,
      defeatCount,
      weakPoint: weakestPoint,
      nemesis,
      avgHitsPerMatch,
      avgFailuresPerMatch,
      avgFailuresBeforeFirstHit,
      logged_in: req.session.logged_in
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
