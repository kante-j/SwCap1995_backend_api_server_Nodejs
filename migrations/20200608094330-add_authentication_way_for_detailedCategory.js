'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('detailedCategories', 'authentication_way',{
      type: Sequelize.INTEGER,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('detailedCategories', 'authentication_way')
  }
};
