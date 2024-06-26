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
    match_date: {}, 
    turns: {},
    match_time: {},
    winner_id: {},
    looser_id: {},
    winner_points: {},
    looser_points: {},
    winner_league_snapshot: {},
    looser_league_snapshot: {}
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'Match'
  }
);

module.exports = Match;
