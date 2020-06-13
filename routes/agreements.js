var express = require('express');
var router = express.Router();
const {user, plan, watcher, point, agreement} = require('../models');
const pushService = require('../modules/push');

router.post('/is_exist', function (req, res) {
    console.log(new Date());
    let response = {
        user_id: req.body.user_id,
        plan_id: req.body.plan_id,
    };
    agreement.findAndCountAll({
        where:{
            user_id:response.user_id,
            plan_id:response.plan_id,
        }
    }).then(agreement =>{
        if(agreement.count != 0){
            res.sendStatus(500)
        }else{
            res.sendStatus(200);
        }
    }).catch(err=>{
        console.log(err);
        res.sendStatus(500);
    })
});

router.post('/', function (req, res) {
    console.log(new Date());
    let response = {
        user_id: req.body.user_id,
        plan_id: req.body.plan_id,
        rule_1_point: req.body.rule_1_point,
        rule_2_point: req.body.rule_2_point,
    };

    console.log(response);
    agreement.create({
        user_id: response.user_id,
        plan_id: response.plan_id,
        rule_1_point: response.rule_1_point,
        rule_2_point: response.rule_2_point,
    }).then((agree)=>{
        watcher.findAndCountAll({
            where:{
                plan_id: response.plan_id
            }
        }).then(watcher_result=>{
            agreement.findAndCountAll({
                where:{
                    plan_id: response.plan_id
                }
            }).then(agreement_result=>{
                let rule1=0.0;
                let rule2 =0.0;
                agreement_result.rows.map(item =>{
                    rule1 += item.dataValues.rule_1_point;
                    rule2 += item.dataValues.rule_2_point;
                });
                rule1 /= agreement_result.count;
                rule2 /= agreement_result.count;

                if(watcher_result.count == agreement_result.count){
                    plan.findOne({
                        include:[{
                            model:user
                        }],
                        where:{id:response.plan_id}
                    }).then((plan_one)=>{
                        if(rule1>2.5 && rule2>2.5){
                            plan_one.update({
                                status: 'start'
                            });
                                pushService.handlePushTokens(plan_one.title+' 플랜이 시작되었습니다💪!!',
                                    plan_one.user.deviceToken, '플랜 시작', 'home');

                        }else{
                            plan_one.update({
                                status: 'reject'
                            });
                            pushService.handlePushTokens(plan_one.title+' 플랜이 거절되었습니다😢 다시 플랜을 만들어주세요',
                                plan_one.user.deviceToken, '플랜 거절', 'home');

                        }
                    })
                }
                res.sendStatus(200)
            }).catch(err=>{
                console.log(err);
                res.sendStatus(500);
            });
        }).catch(err =>{
            console.log(err);
            res.sendStatus(500);
        })
    }).catch(err =>{
        console.log(err);
        res.sendStatus(500);
    })
});

module.exports = router;
