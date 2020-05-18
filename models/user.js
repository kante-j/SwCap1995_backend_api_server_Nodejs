'use strict';
module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define('user', {
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
        // password: {
        //     allowNull: false,
        //     type: DataTypes.STRING(256),
        // },
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
        is_email_login: {
            allowNull: true,
            type: DataTypes.BOOLEAN
        },
        interest_category: {
            allowNull: true,
            type: DataTypes.INTEGER,
        },
        nickname:{
            type: DataTypes.STRING(30),
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
    user.associate = function (models) {
        user.hasMany(models.friend, {
            as: 'friend',
            foreignKey: 'friend_id'
        });

        user.hasMany(models.plan, {
            foreignKey: 'user_id'
        });

        user.hasMany(models.point, {
            foreignKey: 'user_id'
        });

    };
    return user;
};