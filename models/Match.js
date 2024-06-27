const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

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
    turns: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 31
    },
    match_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    player_1_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'player',
        key: 'player_id',
      }
    },
    player_2_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'player',
        key: 'player_id',
      }
    },
    winner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'player',
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
    modelName: 'Match'
  }
);

module.exports = Match;
