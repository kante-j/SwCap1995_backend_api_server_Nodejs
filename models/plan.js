'use strict';
module.exports = (sequelize, DataTypes) => {
    const plan = sequelize.define('plan', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        user_id: {
            allowNull: false,
            type: DataTypes.INTEGER,
        },
        title: {
            allowNull: false,
            type: DataTypes.STRING(256),
        },
        category: {
            allowNull: false,
            type: DataTypes.STRING(50),
        },
        detailedCategory: {
            allowNull: false,
            type: DataTypes.STRING(50),
        },
        picture_rule_1: {
            type: DataTypes.STRING
        },
        picture_rule_2: {
            type: DataTypes.STRING
        },
        picture_rule_3: {
            type: DataTypes.STRING,
        },
        custom_picture_rule_1: {
            type: DataTypes.STRING,
        },
        custom_picture_rule_2: {
            type: DataTypes.STRING
        },
        custom_picture_rule_3: {
            type: DataTypes.STRING
        },
        description:{
            type: DataTypes.STRING
        },
        picture_time: {
            type: DataTypes.INTEGER
        },
        plan_start_day: {
            type: DataTypes.DATE
        },
        bet_money: {
            type: DataTypes.INTEGER
        },
        image_url: {
            type: DataTypes.STRING
        },
        percent: {
            type: DataTypes.INTEGER
        },
        distrib_method:{
            type: DataTypes.STRING
        },
        plan_period: {
            type: DataTypes.INTEGER
        },
        authentication_way: {
            type: DataTypes.INTEGER
        },
        status: {
            type: DataTypes.STRING
        },
        is_public: {
            type: DataTypes.BOOLEAN
        },
        is_custom: {
            type: DataTypes.BOOLEAN
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
    plan.associate = function (models) {
        plan.belongsTo(models.user, {
            foreignKey: 'user_id',
        });
        plan.hasMany(models.watcher,{
            foreignKey: 'plan_id',
            onDelete: 'cascade',
        });
        plan.hasMany(models.daily_authentication,{
            foreignKey: 'plan_id',
            onDelete: 'cascade',
        });
        plan.hasMany(models.agreement,{
            foreignKey: 'plan_id',
            onDelete: 'cascade',
        });
    };
    return plan;
};
