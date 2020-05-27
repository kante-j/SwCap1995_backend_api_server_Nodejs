'use strict';
module.exports = (sequelize, DataTypes) => {
  const plan_template = sequelize.define('plan_template', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    detailedCategory: {
      type: DataTypes.STRING
    },
    main_rule: {
      allowNull: false,
      type: DataTypes.STRING
    },
    sub_rule_1: {
      type: DataTypes.STRING
    },
    sub_rule_2: {
      type: DataTypes.STRING
    },
    sub_rule_3: {
      type: DataTypes.STRING
    },
    authentication_way:{
      type: DataTypes.INTEGER
    },
    image_url:{
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
  plan_template.associate = function(models) {
    // associations can be defined here
  };
  return plan_template;
};