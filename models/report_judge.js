'use strict';
module.exports = (sequelize, DataTypes) => {
  const report_judge = sequelize.define('report_judge', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    plan_id: {
      type: DataTypes.INTEGER
    },
    daily_auth_id: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.STRING
    },
    result: {
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
  report_judge.associate = function(models) {
    // associations can be defined here
  };
  return report_judge;
};
