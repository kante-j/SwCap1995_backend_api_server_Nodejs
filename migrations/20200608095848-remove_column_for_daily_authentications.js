'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('daily_authentications', 'is_correct')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('daily_authentications', 'is_correct',{
      type: Sequelize.BOOLEAN
    })
  }
};
