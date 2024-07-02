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
        req.session.player_name = playerData.name;
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
  
module.exports = router;
  