'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_image = sequelize.define('user_image', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id: {
      type: DataTypes.INTEGER
    },
    image_url: {
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
  user_image.associate = function(models) {
    // associations can be defined here
  };
  return user_image;
};
