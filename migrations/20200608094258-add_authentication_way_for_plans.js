'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('plans', 'authentication_way',{
      type: Sequelize.INTEGER,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('plans', 'authentication_way')
  }
};
