'use strict';
  module.exports = (sequelize, DataTypes) => {
    const point = sequelize.define('point', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id: {
      type: DataTypes.INTEGER
    },
    class: {
      type: DataTypes.STRING
    },
    amount: {
      type: DataTypes.INTEGER
    },
    status: {
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
  point.associate = function(models) {
    point.belongsTo(models.user, {
      foreignKey: 'user_id'
    })
  };
  return point;
};
