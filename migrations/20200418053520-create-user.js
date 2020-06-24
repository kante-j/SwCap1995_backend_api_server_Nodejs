'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            email: {
              allowNull: false,
                type: Sequelize.STRING(30),
            },
            password: {
              allowNull: false,
                type: Sequelize.STRING(256),
            },
            sex: {
              allowNull: false,
                type: Sequelize.STRING(10),
            },
            age: {
              allowNull: false,
              defaultValue:0,
                type: Sequelize.INTEGER
            },
            is_face_detection: {
              allowNull: true,
                type: Sequelize.BOOLEAN
            },
            interest_category: {
              allowNull: true,
                type: Sequelize.STRING(256),
            },
            weight: {
              allowNull: true,
                type: Sequelize.DOUBLE,
            },
            createAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('users');
    }
};
