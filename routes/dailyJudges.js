var express = require('express');
var router = express.Router();
const {user, plan, friend, watcher, daily_judge, daily_authentication} = require('../models');

router.post('/is_exist', function (req, res) {
    console.log(new Date());

    let response = {
        user_id: req.body.user_id,
        daily_auth_id: req.body.daily_auth_id
    };

    daily_judge
        .findAndCountAll({
        where:{
            user_id:response.user_id,
            daily_auth_id:response.daily_auth_id,
        }
    }).then(daily_judge =>{
        if(daily_judge.count != 0){
            res.sendStatus(500)
        }else{
            res.sendStatus(200);
        }
    }).catch(err=>{
        console.log(err);
        res.sendStatus(503);
    })
});

router.post('/', function (req, res) {
    console.log(new Date());
    let response = {
        user_id: req.body.user_id,
        daily_auth_id: req.body.daily_auth_id,
        is_correct: req.body.is_correct,
        emoticon: req.body.emoticon,
        comment: req.body.comment
    };

    daily_authentication.findOne({
        include:[{
            model: plan
        }],
        where:{
            id: response.daily_auth_id
        }
    }).then(daily_auth =>{
        console.log(daily_auth.plan);
        watcher.findAndCountAll({
            where:{
                plan_id: daily_auth.plan.id
            }
        }).then((watcher_items) =>{
            // 감시자 수 계산 => 일일 감시 수랑 계산해서
            let watcher_count = watcher_items.count;

                daily_judge.create({
                    user_id: response.user_id,
                    daily_auth_id: response.daily_auth_id,
                    is_correct: response.is_correct,
                    emoticon: response.emoticon,
                    comment: response.comment
                }).then(daily_judge_item => {

                    daily_judge.findAndCountAll({
                        where:{
                            daily_auth_id: response.daily_auth_id
                        }
                    }).then(daily_judge_items =>{
                        let daily_judge_count = daily_judge_items.count;
                        if(watcher_count === daily_judge_count){
                            daily_auth.update({status:'done'});
                        }

                        res.sendStatus(200);
                    });

                }).catch(err => {
                    console.log(err);
                    res.sendStatus(500);
                });



        })
    })
});

module.exports = router;
