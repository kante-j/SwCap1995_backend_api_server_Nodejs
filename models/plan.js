'use strict';
module.exports = (sequelize, DataTypes) => {
  const plan = sequelize.define('plan', {
    user_id: DataTypes.INTEGER
  }, {});
  plan.associate = function(models) {
    // associations can be defined here
  };
  return plan;
};