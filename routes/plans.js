var express = require('express');
var router = express.Router();

const {user, friend, plan} = require('../models');

/**
 * @swagger
 * definitions:
 *  plan:
 *   type: object
 *   properties:
 *     id:
 *       type: integer
 *       description: 유저 id
 *     user_id:
 *       type: integer
 *       description: 유저 user_id
 *     title:
 *       type: string
 *       description: 플랜 title
 *     is_public:
 *       type: boolean
 *       description: 플랜 is_public
 *     picture_rule_1:
 *       type: string
 *       description: 플랜 picture_rule
 *     picture_rule_2:
 *       type: string
 *       description: 플랜 picture_rule
 *     picture_rule3:
 *       type: string
 *       description: 플랜 picture_rule
 *     custom_picture_rule_1:
 *       type: string
 *       description: 플랜 custom_picture_rule_1
 *     custom_picture_rule_2:
 *       type: string
 *       description: 플랜 custom_picture_rule_2
 *     custom_picture_rule_3:
 *       type: string
 *       description: 플랜 custom_picture_rule_3
 *     picture_time:
 *       type: string
 *       description: 플랜 picture_time
 *     plan_start_day:
 *       type: string
 *       description: 플랜 plan_start_day
 *     plan_period:
 *       type: integer
 *       description: 플랜 기간
 *     bet_money:
 *       type: string
 *       description: 플랜 bet_money
 *     status:
 *       type: string
 *       description: 플랜 status
 */



/**
 * @swagger
 * paths:
 *  /plans/{plan_id}:
 *    get:
 *      tags:
 *      - plan
 *      summary: "get one plan"
 *      description: "Returns a plan"
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - name: "plan_id"
 *        in: "path"
 *        required: true
 *        type: "integer"
 *
 *      responses:
 *       200:
 *        description: category of column list
 *        schema:
 *          type: string
 */
router.get('/:plan_id', function (req, res) {
    console.log(new Date());

    plan.findOne({
        where:{
            id: req.params.plan_id
        }
    }).then((plan)=>{
        res.send(plan);
    }).catch(err =>{
        console.log(err);
        res.send(500)
    })
});



/**
 * @swagger
 * paths:
 *  /plans:
 *    post:
 *      tags:
 *      - plan
 *      summary: "plan create"
 *      description: "create a plan"
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - name: "body"
 *        in: "body"
 *        required: true
 *        type: "integer"
 *        schema:
 *          $ref: "#/definitions/plan"
 *
 *      responses:
 *       200:
 *        description: category of column list
 *        schema:
 *          type: string
 */
router.post('/', function (req, res) {
    console.log(new Date());

    let response = {
        user_id: req.body.user_id,
        title: req.body.title,
        category: req.body.category,
        picture_rule_1: req.body.picture_rule_1,
        picture_rule_2: req.body.picture_rule_2,
        picture_rule_3: req.body.picture_rule_3,
        custom_picture_rule_1: req.body.custom_picture_rule_1,
        custom_picture_rule_2: req.body.custom_picture_rule_2,
        custom_picture_rule_3: req.body.custom_picture_rule_3,
        plan_period: req.body.plan_period,
        picture_time: req.body.picture_time,
        createdAt: Date.now(),
        plan_start_day: req.body.plan_start_day,
        bet_money: req.params.bet_money,
        status: 'waiting',
        is_public: req.params.is_public,

    };

    plan.create({
        user_id: response.user_id,
        title: response.title,
        category: response.category,
        picture_rule_1: response.picture_rule_1,
        picture_rule_2: response.picture_rule_2,
        picture_rule_3: response.picture_rule_3,
        custom_picture_rule_1: response.custom_picture_rule_1,
        custom_picture_rule_2: response.custom_picture_rule_2,
        custom_picture_rule_3: response.custom_picture_rule_3,
        plan_period: response.plan_period,
        picture_time: response.picture_time,
        createdAt: Date.now(),
        plan_start_day: response.plan_start_day,
        bet_money: req.params.bet_money,
        status: 'waiting',
        is_public: req.params.is_public,
    }).then(res.send(200))
        .catch(err =>{
            console.log(err);
            res.send(500);
        });


    console.log(req);
});



/**
 * @swagger
 * paths:
 *  /plans/all/{user_id}:
 *    get:
 *      tags:
 *      - plan
 *      summary: "get all plans by user_id"
 *      description: "Returns all plans"
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - name: "user_id"
 *        in: "path"
 *        required: true
 *        type: "integer"
 *
 *      responses:
 *       200:
 *        description: category of column list
 *        schema:
 *          type: string
 */
router.get('/all/:user_id', function (req, res) {
    console.log(new Date());

    plan.findAndCountAll({
        where:{
            user_id: req.params.user_id
        }
    }).then((plans)=>{
        res.send(plans);
    }).catch(err =>{
        console.log(err);
        res.send(500)
    })
});


router.get('/')


module.exports = router;
