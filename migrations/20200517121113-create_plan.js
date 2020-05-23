'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('plans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING(256),
      },
      category: {
        allowNull: false,
        type: Sequelize.STRING(50),
      },
      picture_rule_1: {
        type: Sequelize.INTEGER
      },
      picture_rule_2: {
        type: Sequelize.INTEGER
      },
      picture_rule_3: {
        type: Sequelize.INTEGER,
      },
      custom_picture_rule_1: {
        type: Sequelize.STRING,
      },
      custom_picture_rule_2: {
        type: Sequelize.STRING
      },
      custom_picture_rule_3: {
        type: Sequelize.STRING
      },
      picture_time: {
        type: Sequelize.DATE
      },
      plan_start_day: {
        type: Sequelize.DATE
      },
      bet_money: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING
      },
      is_public: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('plans');
  }
};
