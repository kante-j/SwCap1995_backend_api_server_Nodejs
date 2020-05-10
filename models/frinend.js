'use strict';
module.exports = (sequelize, DataTypes) => {
  const friend = sequelize.define('friend', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id: {
      type: DataTypes.INTEGER
    },
    friend_id: {
      type: DataTypes.INTEGER
    },
    isaccept: {
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
  friend.associate = function(models) {
    friend.belongsTo(models.user, {foreignKey: 'user_id'});
  };
  return friend;
};