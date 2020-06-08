'use strict';
module.exports = (sequelize, DataTypes) => {
  const daily_judge = sequelize.define('daily_judge', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id: {
      type: DataTypes.INTEGER
    },
    daily_auth_id: {
      type: DataTypes.INTEGER
    },
    is_correct: {
      type: DataTypes.BOOLEAN
    },
    emoticon: {
      type: DataTypes.INTEGER
    },
    comment: {
      type: DataTypes.STRING
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {});
  daily_judge.associate = function(models) {
    daily_judge.belongsTo(models.user, {foreignKey: 'user_id'});
    daily_judge.belongsTo(models.daily_authentication, {foreignKey: 'daily_auth_id'});
  };
  return daily_judge;
};
