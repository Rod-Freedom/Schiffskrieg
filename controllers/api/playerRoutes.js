const router = require('express').Router();
const { Player } = require('../../models');

router.post('/login', async (req, res) => {
    try {
      const playerData = await Player.findOne({ where: { email: req.body.email } });
  
      if (!playerData) {
        res
          .status(400)
          .json({ message: 'Incorrect email or password, please try again' });
        return;
      }
  
      const validPassword = await playerData.checkPassword(req.body.password);
  
      if (!validPassword) {
        res
          .status(400)
          .json({ message: 'Incorrect email or password, please try again' });
        return;
      }
  
      req.session.save(() => {
        req.session.nickname = playerData.nickname;
        req.session.player_id = playerData.player_id;
        req.session.logged_in = true;
        
        res.json({ player: playerData, message: 'You are now logged in!' });
      });
  
    } catch (err) {
      res.status(400).json(err);
    }
  });

router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
});

router.post('/signup', async (req, res) => {
  try {
    const player = await Player.create(req.body);
    req.session.save(() => {
      req.session.nickname = player.nickname;
      req.session.player_id = player.player_id;
      req.session.logged_in = true;

      res.status(200).json(player);
    });
  } catch (err) {
    // Log the error details
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

router.post('/profile', async (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

  
module.exports = router;
  