'use strict';
module.exports = (sequelize, DataTypes) => {
  const watcher = sequelize.define('watcher', {
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
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {});
  watcher.associate = function(models) {
    // associations can be defined here
    watcher.belongsTo(models.plan, {as:'plan', foreignKey:'plan_id'});
  };
  return watcher;
};