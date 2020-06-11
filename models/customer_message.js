'use strict';
module.exports = (sequelize, DataTypes) => {
  const customer_message = sequelize.define('customer_message', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id:{
      type: DataTypes.INTEGER
    },
    title: {
      type: DataTypes.STRING
    },
    message: {
      type: DataTypes.STRING
    },
    message_type: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    answer: {
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
  customer_message.associate = function(models) {
    customer_message.belongsTo(models.user, {foreignKey: 'user_id'})
  };
  return customer_message;
};
