'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('points', 'status',{
      type: Sequelize.STRING,
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('points', 'status')
  }
};
