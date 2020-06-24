var express = require('express');
var router = express.Router();
const {user, plan, friend, watcher, daily_judge, daily_authentication} = require('../models');

/**
 * @swagger
 * definitions:
 *  daily_judge:
 *   type: object
 *   properties:
 *     id:
 *       type: integer
 *       description: agreement id
 *     user_id:
 *       type: integer
 *       description: 유저 id
 *     daily_auth_id:
 *       type: integer
 *       description: daily_auth_id
 *     emoticon:
 *       type: integer
 *       description: emoticon
 *     is_correct:
 *       type: boolean
 *       description: is_correct
 *     comment:
 *       type: string
 *       description: comment
 */



/**
 * @swagger
 * paths:
 *  /daily_judges/is_exist:
 *    post:
 *      tags:
 *      - daily_judge
 *      summary: "is exist daily_judge"
 *      description: "Returns if exist daily_judge about daily_auth"
 *      consumes:
 *      - "application/json"
 *      - "application/xml"
 *      - x-www-form-urlencoded
 *      parameters:
 *      - in: body
 *        name: daily_judge
 *        schema:
 *          type: object
 *          required:
 *            - user_id
 *            - daily_auth_id
 *          properties:
 *            user_id:
 *              type: integer
 *            daily_auth_id:
 *              type: integer
 *      produces:
 *      - application/json
 *      responses:
 *       200:
 *        description: is in daily judge table
 *        schema:
 *          type: status code
 *       500:
 *        description: is not exist
 *        schema:
 *          type: status code
 */
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
        res.send(daily_judge);
    }).catch(err=>{
        console.log(err);
        res.sendStatus(503);
    })
});


/**
 * @swagger
 * paths:
 *  /daily_judges:
 *    post:
 *      tags:
 *      - daily_judge
 *      summary: "is exist daily_judge"
 *      description: "Returns if exist daily_judge about daily_auth"
 *      consumes:
 *      - "application/json"
 *      - "application/xml"
 *      - x-www-form-urlencoded
 *      parameters:
 *      - in: body
 *        name: daily_judge
 *        schema:
 *          type: object
 *          required:
 *            - user_id
 *            - daily_auth_id
 *            - is_correct
 *            - emoticon
 *            - comment
 *          properties:
 *            user_id:
 *              type: integer
 *            daily_auth_id:
 *              type: integer
 *            is_correct:
 *              type: boolean
 *            emoticon:
 *              type: integer
 *            comment:
 *              type: string
 *      produces:
 *      - application/json
 *      responses:
 *       200:
 *        description: daily judge succesfully create
 *        schema:
 *          type: status code
 *       500:
 *        description: is not exist
 *        schema:
 *          type: status code
 */
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
