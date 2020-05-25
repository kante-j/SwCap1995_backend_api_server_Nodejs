'use strict';
module.exports = (sequelize, DataTypes) => {
  const detailedCategory = sequelize.define('detailedCategory', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    topCategoryNum: {
      type: DataTypes.INTEGER
    },
    detailedCategory: {
      type: DataTypes.STRING
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
  detailedCategory.associate = function(models) {
    detailedCategory.belongsTo(models.category, {foreignKey: 'topCategoryNum'});
  };
  return detailedCategory;
};