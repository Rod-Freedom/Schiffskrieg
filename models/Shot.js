const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

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
          model: 'match',
          key: 'match_id',
        }
    }, 
    shooter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'player',
        key: 'player_id',
      }
    },
    target_x: {
      type: DataTypes.TIME,
      allowNull: false
    },
    target_x: {
        type: DataTypes.INTEGER,
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
    modelName: 'Shot'
  }
);

module.exports = Shot;
