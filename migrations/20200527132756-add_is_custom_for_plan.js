'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('plans', 'is_custom',{
      type: Sequelize.BOOLEAN,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('plans', 'is_custom')
  }
};
