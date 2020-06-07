'use strict';
module.exports = (sequelize, DataTypes) => {
  const daily_authentication = sequelize.define('daily_authentication', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id: {
      type: DataTypes.INTEGER
    },
    plan_id: {
      type: DataTypes.INTEGER
    },
    is_correct:{
      type: DataTypes.BOOLEAN
    },
    image_url:{
      type: DataTypes.BOOLEAN
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
  daily_authentication.associate = function(models) {
    daily_authentication.belongsTo(models.user, {foreignKey: 'user_id'});
    daily_authentication.belongsTo(models.plan, {foreignKey: 'plan_id'});
  };
  return daily_authentication;
};
