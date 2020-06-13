'use strict';
module.exports = (sequelize, DataTypes) => {
  const notice = sequelize.define('notice', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    title: {
      type: DataTypes.STRING
    },
    content: {
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
  notice.associate = function(models) {
    // associations can be defined here
  };
  return notice;
};
