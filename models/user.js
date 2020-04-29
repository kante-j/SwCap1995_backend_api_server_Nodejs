'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        email: {
            allowNull: false,
            type: DataTypes.STRING(30),
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING(30),
        },
        sex: {
            allowNull: false,
            type: DataTypes.STRING(10),
        },
        age: {
            allowNull: false,
            defaultValue: 0,
            type: DataTypes.INTEGER
        },
        is_face_detection: {
            allowNull: true,
            type: DataTypes.BOOLEAN
        },
        interest_category: {
            allowNull: true,
            type: DataTypes.INTEGER,
        },
        weight: {
            allowNull: true,
            type: DataTypes.INTEGER,
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
    }, {});
    User.associate = function (models) {
        // associations can be defined here
    };
    return User;
};