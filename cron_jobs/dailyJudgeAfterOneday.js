const {watcher, daily_judge, daily_authentication} = require('../models');
const sequelize = require("sequelize");
const Op = sequelize.Op;
var exports = module.exports = {};


exports.authIsDone = function (path) {

    let today = new Date();
    console.log(today)
    let startdate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() - 1)
        + ' ' + today.getHours();
    let time = ':00:00';
    let startTime = new Date(startdate + time);

    daily_authentication.findAndCountAll({
        where: {// 일일 인증을 하고나서 하루가 지났을 때
            [Op.or]: [{
                createdAt: {
                    [Op.between]: [startTime, today]
                }
            }],
            status: 'undone'
        }
    }).then(daily_auth_items => {
        daily_auth_items.rows.map(daily_auth_item => {
            watcher.findAndCountAll({
                where: {
                    plan_id: daily_auth_item.plan_id
                }
            }).then(watcher_items => {
                let watcher_count = watcher_items.count;

                daily_judge.findAndCountAll({
                    where: {
                        daily_auth_id: daily_auth_item.id
                    }
                }).then(daily_judge_items => {
                    let daily_judge_count = daily_judge_items.count;
                    // daily_judge가 watcher로 참여된 사람의 수의 절반 이상이고
                    if (watcher_count < daily_judge_count * 2) {
                        // daily_judge의 is_accept가 감시로 참여한 사람의 수의절반 이상이면
                        let is_accept_count = 0;
                        daily_judge_items.rows.map(item => {
                            if (item.is_correct === true) {
                                is_accept_count++;
                            }
                        });
                        if (is_accept_count * 2 > daily_judge_count) {
                            // daily_authentication을 done으로 바꾼다.
                            daily_auth_item.update({status: 'done'})
                        } else {
                            // 절반 이하면 reject
                            daily_auth_item.update({status: 'reject'})
                        }
                    }else{
                        // daily_judge가 watcher로 참여된 사람의 수의 절반 이하이면 무효
                        daily_auth_item.update({status: 'invalid'})
                    }
                })
            })
        })
    });
};
