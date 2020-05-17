'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('plans')
  },

  down: (queryInterface, Sequelize) => {

  }
};
