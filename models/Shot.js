const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Match = require('./Match');
const Player = require('./Player');

class Shot extends Model {}

Shot.init(
  {
    shot_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    match_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Match,
          key: 'match_id',
        }
    }, 
    shooter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Player,
        key: 'player_id',
      }
    },
    coordinate: {
      type: DataTypes.STRING,
      allowNull: false
    },
    result: {
        type: DataTypes.STRING,
        allowNull: false
    }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'shot'
  }
);

module.exports = Shot;
