'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'password')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'password',{
        allowNull: false,
        type: Sequelize.STRING(256),
    })
  }
};
