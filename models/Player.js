const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Player extends Model {}

Player.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {},
    victories: {},
    defeats: {},
    league_level: {},
    total_points: {},
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'Player'
  }
);

module.exports = Player;
