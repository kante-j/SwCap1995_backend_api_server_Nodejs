'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('plans', 'image_url',{
      type: Sequelize.STRING,
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('plans', 'image_url')
  }
};
