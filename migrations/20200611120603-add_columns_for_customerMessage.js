'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('customer_messages', 'email', {
        type: Sequelize.STRING,
      }).then(()=> queryInterface.addColumn('customer_messages', 'answer', {
      type: Sequelize.STRING,
    }))


  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('customer_messages', 'email'),
      queryInterface.removeColumn('customer_messages', 'answer')
    ])
  }
};
