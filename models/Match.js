const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Match extends Model {}

Match.init(
  {
    id: {
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
    winner_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    looser_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    winner_points: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    looser_points: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    winner_league_snapshot: {
      type: DataTypes.STRING,
      allowNull: false
    },
    looser_league_snapshot: {
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
