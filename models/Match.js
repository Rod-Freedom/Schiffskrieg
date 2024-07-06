const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Player = require('./Player');

class Match extends Model {}

Match.init(
  {
    match_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    match_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }, 
    player_1_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Player,
        key: 'player_id',
      }
    },
    player_2_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Player,
        key: 'player_id',
      }
    },
    winner_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Player,
        key: 'player_id',
      }
    },
    player_1_points: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    player_2_points: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    player_1_league_snapshot: {
      type: DataTypes.STRING,
      allowNull: false
    },
    player_2_league_snapshot: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'match'
  }
);

module.exports = Match;
