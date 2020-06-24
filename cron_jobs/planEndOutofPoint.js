const {user, watcher, daily_judge, plan, daily_authentication} = require('../models');
const sequelize = require("sequelize");
const Op = sequelize.Op;
var exports = module.exports = {};
const pushService = require('../modules/push');

//플랜에 건 돈이 다 떨어졌을 때, 플랜 종료



exports.planEndOutofPoint = function (path) {

    plan.findAndCountAll({
        include: [{
            model: user,
            attributes: ['deviceToken'],
        }, {
            model: daily_authentication,
            where: {
                status: 'reject'
            },
        }],
        where: {
            status: 'start'
        },
    }).then(plan_items => {
        plan_items.rows.map(plan_item => {
            let start_point = plan_item.bet_money;
            let reject_count = plan_item.daily_authentications.length;
            let percent = plan_item.percent;

            if (start_point - start_point * reject_count / 100 * percent < 0) {
                pushService.handlePushTokens("<"+plan_item.title+ '> 플랜의 포인트를 소진하여 플랜이 종료되었어요😥!',
                    plan_item.user.deviceToken, '플랜 종료', 'home');
                plan_item.update({
                    status: 'end'
                })
            }
        })
    });
};
