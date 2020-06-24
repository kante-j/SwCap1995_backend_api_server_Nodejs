const {user, watcher, daily_judge, plan, daily_authentication} = require('../models');
const sequelize = require("sequelize");
const Op = sequelize.Op;
const pushService = require('../modules/push');
var exports = module.exports = {};

//플랜 종료일이 끝났을 때, 플랜의 상태가 start인 경우 플랜을 end 시킨다

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

exports.planEndAfterEndDate = function (path) {

    let today = new Date();

    plan.findAndCountAll({
        include: [{
            model: user,
            attributes: ['deviceToken'],
        }],
        where:{
            status: 'start'
        }
    }).then(plan_items =>{
        plan_items.rows.map(plan_item =>{
            let before_date = addDays(plan_item.plan_start_day,plan_item.plan_period*7);
            let startdate = before_date.getFullYear() + '-' + (before_date.getMonth() + 1) + '-' + (before_date.getDate())
                + ' ' + before_date.getHours();
            let time = ':00:00';
            let date = new Date(startdate + time);
            if(date <today){
                pushService.handlePushTokens("<"+plan_item.title+ '> 플랜이 목표달성기간을 지나 플랜이 종료되었어요!😁' +
                    '결과를 확인해보세요!✅',
                    plan_item.user.deviceToken, '플랜 종료', 'home');
                plan_item.update({status: 'end'})
            }
        })
    });
};
