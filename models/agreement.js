'use strict';
module.exports = (sequelize, DataTypes) => {
  const agreement = sequelize.define('agreement', {
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
    rule_1_point: {
      type: DataTypes.INTEGER
    },
    rule_2_point: {
      type: DataTypes.INTEGER
    },
    rule_3_point: {
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
  agreement.associate = function(models) {
    // associations can be defined here
  };
  return agreement;
};
