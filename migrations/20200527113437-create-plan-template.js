'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('plan_templates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      detailedCategory: {
        type: Sequelize.STRING
      },
      main_rule: {
        allowNull: false,
        type: Sequelize.STRING
      },
      sub_rule_1: {
        type: Sequelize.STRING
      },
      sub_rule_2: {
        type: Sequelize.STRING
      },
      sub_rule_3: {
        type: Sequelize.STRING
      },
      authentication_way:{
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('plan_templates');
  }
};