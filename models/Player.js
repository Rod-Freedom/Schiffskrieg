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
    nickname: {
        type: DataTypes.STRING,
        allowNull: false
      },
    email: {},
    password: {},
    victories: {},
    defeats: {},
    total_points: {},
    league_level: {}
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'Player'
  }
);

module.exports = Player;
