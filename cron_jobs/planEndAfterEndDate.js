const {user, watcher, daily_judge, plan, point, daily_authentication} = require('../models');
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
        where: {
            status: 'start'
        }
    }).then(plan_items => {
        plan_items.rows.map(plan_item => {
            let before_date = addDays(plan_item.plan_start_day, plan_item.plan_period * 7);
            let startdate = before_date.getFullYear() + '-' + (before_date.getMonth() + 1) + '-' + (before_date.getDate())
                + ' ' + before_date.getHours();
            let time = ':00:00';
            let date = new Date(startdate + time);
            if (date < today) {
                pushService.handlePushTokens("<" + plan_item.title + '> 플랜이 목표달성기간을 지나 플랜이 종료되었어요!😁' +
                    '결과를 확인해보세요!✅',
                    plan_item.user.deviceToken, '플랜 종료', 'plan_detail');
                plan_item.update({status: 'end'})

                watcher.findAndCountAll({
                    where: {
                        plan_id: plan_item.id
                    }
                }).then(watcher_items => {
                    // 처리히가 쉽도록 배열로 저장
                    watcher_items.rows.map(item => {
                        watchers[item.user_id] = {count: 0, point_sum: 0, point: []}
                    });

                    if (plan_item !== null) {
                        plan_item.daily_authentications.map(daily_auth_items => {
                            let check_point_distributed = false;
                            if (daily_auth_items.daily_judges.length !== 0) {
                                daily_auth_items.daily_judges.map(daily_judge_items => {
                                    let user_id = daily_judge_items.user_id.toString();
                                    watchers[daily_judge_items.user_id]['count']++;

                                    if (check_point_distributed === false && daily_auth_items.status === 'reject') {
                                        if (plan_item.distrib_method === '선착순') {
                                            const daily_point = {};
                                            daily_point['date'] = daily_auth_items.updatedAt;
                                            daily_point['point'] = plan_item.bet_money * (plan_item.percent / 100) * weight;

                                            watchers[daily_judge_items.user_id]['point'].push(daily_point);
                                            watchers[daily_judge_items.user_id]['point_sum'] += plan_item.bet_money * (plan_item.percent / 100);
                                            check_point_distributed = true;
                                        } else if (plan_item.distrib_method === '추첨') {

                                            let randNum = daily_judge_items.createdAt.getMinutes();
                                            let keys = Object.keys(watchers);
                                            let randIndex = (randNum - 1) % keys.length;
                                            let randKey = keys[randIndex];
                                            let name = watchers[randKey];


                                            const daily_point = {};
                                            daily_point['date'] = daily_auth_items.updatedAt;
                                            daily_point['point'] = plan_item.bet_money * (plan_item.percent / 100) * weight;

                                            watchers[randKey]['point'].push(daily_point);
                                            // watchers[randKey]['point'].push([daily_auth_items.updatedAt,plan_item.bet_money * (plan_item.percent/100)])
                                            watchers[randKey]['point_sum'] += plan_item.bet_money * (plan_item.percent / 100);
                                        } else {

                                            const daily_point = {};
                                            daily_point['date'] = daily_auth_items.updatedAt;
                                            daily_point['point'] = plan_item.bet_money * (plan_item.percent / 100) / watcher_items.count * weight;

                                            watchers[daily_judge_items.user_id]['point'].push(daily_point);

                                            // watchers[daily_judge_items.user_id]['point'].push([daily_auth_items.updatedAt,plan_item.bet_money*(plan_item.percent/100) /watcher_items.count ])
                                            watchers[daily_judge_items.user_id]['point_sum'] += plan_item.bet_money * (plan_item.percent / 100) / watcher_items.count;
                                        }
                                    }
                                })
                            }

                            //여가디가 포인트 분배
                            let sum = 0
                            for (const key in watchers) {
                                point.create({
                                    user_id: key,
                                    class: 'challenge',
                                    amount: watchers[key]['point_sum'],
                                    status: 'accept'
                                });
                                sum += watchers[key]['point_sum'];
                            }

                            point.create({
                                user_id: plan_item.user.id,
                                class: 'challenge',
                                amount: sum * (-1),
                                status: 'accept'
                            })
                        });
                    }
                })
            }
        })
    });
};

