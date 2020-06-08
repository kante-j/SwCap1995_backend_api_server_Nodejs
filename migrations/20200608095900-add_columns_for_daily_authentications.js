'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('daily_authentications', 'comment', {
                type: Sequelize.STRING,
            }),
            queryInterface.addColumn('daily_authentications', 'status', {
                type: Sequelize.STRING,
            })
        ])
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn('daily_authentications', 'comment'),
            queryInterface.removeColumn('daily_authentications', 'status')
        ])
    }
};
