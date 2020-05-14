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
      type: DataTypes.INTEGER,
      // references:{
      //   model: 'users',
      //   key: 'id'
      // }
    },
    friend_id: {
      type: DataTypes.INTEGER,
      // references:{
      //   model: 'users',
      //   key: 'id'
      //
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
    friend.belongsTo(models.user, {as:'user', foreignKey:'user_id'})
    // friend.belongsTo(models.user, {as:'followed', foreignKey:'friend_id'})
    // friend.belongsTo(models.user, {
    //   as: 'follower',
    //   // foreignKey: 'user_id'
    // });
    // friend.belongsTo(models.user, {
    //   as: 'followed',
    //   // foreignKey: 'user_id'
    // });
    // friend.belongsToMany(models.user, { through:'me', as: 'me1' });
    // friend.belongsToMany(models.user, {through:'other', as: 'other1' });
  };
  return friend;
};