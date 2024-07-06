const sequelize = require('../config/connection');
const { Player, Shot, Match } = require('../models');

const playerData = require('./playerData.json');
const shotData = require('./shotData.json');
const matchData = require('./matchData.json');

const seedDatabase = async () => {
  try{

    await sequelize.sync({ force: true });
  
    await Player.bulkCreate(playerData, {
      individualHooks: true,
      returning: true,
    });
  
    await Match.bulkCreate(matchData, {
      individualHooks: true,
      returning: true,
    });

    await Shot.bulkCreate(shotData, {
      individualHooks: true,
      returning: true,
    });

    process.exit(0);
  }catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1); // Exit with error
  };
};

seedDatabase();
