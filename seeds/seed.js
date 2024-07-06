const sequelize = require('../config/connection');
const { Player,Shot } = require('../models');

const playerData = require('./playerData.json');
const ShotData = require('./ShotData.json');

const seedDatabase = async () => {
  
  await sequelize.sync({ force: true });

  await Player.bulkCreate(playerData, {
    individualHooks: true,
    returning: true,
  });

  await Shot.bulkCreate(ShotData, {
    individualHooks: true,
    returning: true,
  });

  process.exit(0);
};

seedDatabase();
