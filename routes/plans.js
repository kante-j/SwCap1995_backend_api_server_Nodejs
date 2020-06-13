var express = require('express');
var router = express.Router();
const pushService = require('../modules/push');
const {user, plan, watcher, point, daily_authentication} = require('../models');
const paginate = require('express-paginate');
const sequelize = require("sequelize");
const multer = require("multer");
const multerS3 = require('multer-s3');
const secretKey = require('../secretKey')
const AWS = require('aws-sdk');

const endpoint = new AWS.Endpoint('https://kr.object.ncloudstorage.com');
const region = 'kr-standard';
const access_key = secretKey.ACCESS_KEY;
const secret_key = secretKey.SECRET_KEY;

const s3 = new AWS.S3({
    endpoint: endpoint,
    region: region,
    credentials: {
        accessKeyId: access_key,
        secretAccessKey: secret_key
    },
});

const uploadImage = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'swcap1995/plan_images',
        acl: 'public-read',
        metadata(req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key(req, file, cb) {
            cb(null, Date.now().toString() + '.png');
        }
    })
});
const Op = sequelize.Op;


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
 *  /plans:
 *    get:
 *      tags:
 *      - plan
 *      summary: "get all plan"
 *      description: "Returns all plan"
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - in: path
 *        name: limit
 *        type: integer
 *        required: true
 *        description: pagination -> limit
 *      - in: path
 *        name: page
 *        type: integer
 *        required: true
 *        description: pagination -> page number
 *
 *      responses:
 *       200:
 *        description: category of column list
 *        schema:
 *          type: string
 */
router.use(paginate.middleware(10, 50));
router.get('/', async function (req, res) {
    console.log(new Date());


    // This example assumes you've previously defined `Users`
    // as `const Users = db.model('Users')` if you are using `mongoose`
    // and that you are using Node v7.6.0+ which has async/await support
    plan.findAndCountAll({
        include: [{
            model: user
        }],
        limit: req.query.limit,
        offset: req.skip,
        order: [['updatedAt', 'desc'], ['id', 'desc']]
    })
        .then(results => {
            const itemCount = results.count;
            const pageCount = Math.ceil(results.count / req.query.limit);
            res.send({
                plans: results.rows,
                pageCount,
                itemCount,
                pages: paginate.getArrayPages(req)(pageCount, pageCount, req.query.page)
            });
        }).catch(err => {
        console.log(err);
        next(err)
    })
});

/**
 * @swagger
 * paths:
 *  /plans/search:
 *    get:
 *      tags:
 *      - plan
 *      summary: "get all plan"
 *      description: "Returns all plan"
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - in: path
 *        name: limit
 *        type: integer
 *        required: false
 *        description: pagination -> limit
 *      - in: path
 *        name: page
 *        type: integer
 *        required: false
 *        description: pagination -> page number
 *      - in: path
 *        name: query
 *        type: string
 *        required: true
 *        description: pagination -> query
 *
 *      responses:
 *       200:
 *        description: category of column list
 *        schema:
 *          type: string
 */
router.get('/search', async function (req, res) {
    console.log(new Date());

    let search_keyword = req.query.query;
    // This example assumes you've previously defined `Users`
    // as `const Users = db.model('Users')` if you are using `mongoose`
    // and that you are using Node v7.6.0+ which has async/await support
    let user_ids = [];

    user.findAndCountAll({
        where: {
            nickname: {
                [Op.like]: '%' + search_keyword + '%'
            }
        }
    }).then(users => {
        users.rows.map(item => {
            user_ids.push(item.id);
        });
        console.log(user_ids);
        plan.findAndCountAll({
            include: [{
                model: user
            }],
            where: {
                [Op.or]: [
                    {
                        title: {
                            [Op.like]: '%' + search_keyword + '%'
                        }
                    },
                    {
                        category: {
                            [Op.like]: '%' + search_keyword + '%'
                        }
                    },
                    {
                        detailedCategory: {
                            [Op.like]: '%' + search_keyword + '%'
                        }
                    },
                    {
                        user_id: user_ids
                    }
                ]
            },
            limit: req.query.limit, offset: req.skip,
            order: [['updatedAt', 'desc'], ['id', 'desc']]
        })
            .then(results => {
                const itemCount = results.count;
                const pageCount = Math.ceil(results.count / req.query.limit);
                res.send({
                    plans: results.rows,
                    pageCount,
                    itemCount,
                    pages: paginate.getArrayPages(req)(pageCount, pageCount, req.query.page)
                });
            }).catch(err => {
            console.log(err);
            next(err)
        })
    }).catch(err => {
        console.log(err);
        res.sendStatus(500)
    });

});

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
        include: [{
            model: user
        }],
        where: {
            id: req.params.plan_id
        },
        order: [['updatedAt', 'desc'], ['id', 'desc']]
    }).then((plan) => {
        res.send(plan);
    }).catch(err => {
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
router.post('/', uploadImage.single('photo'), function (req, res) {
    console.log(new Date());
    let response = {
        user_id: req.body.user_id,
        title: req.body.title,
        category: req.body.category,
        detailedCategory: req.body.detailedCategory,
        picture_rule_1: req.body.picture_rule_1,
        picture_rule_2: req.body.picture_rule_2,
        picture_rule_3: req.body.picture_rule_3,
        custom_picture_rule_1: req.body.custom_picture_rule_1,
        custom_picture_rule_2: req.body.custom_picture_rule_2,
        custom_picture_rule_3: req.body.custom_picture_rule_3,
        authentication_way: req.body.authentication_way,
        plan_period: req.body.plan_period,
        picture_time: req.body.picture_time,
        distrib_method: req.body.distrib_method,
        image_url: 'https://kr.object.ncloudstorage.com/swcap1995/plan_images/' + req.file.key,
        percent: req.body.percent,
        createdAt: Date.now(),
        plan_start_day: req.body.plan_start_day,
        bet_money: req.body.bet_money,
        is_custom: req.body.is_custom,
        status: 'waiting',
        is_public: req.body.is_public,
        spectors: req.body.spectors,
    };

    console.log(response);
    let watchersList = response.spectors.split(',');

    plan.create({
        user_id: response.user_id,
        title: response.title,
        category: response.category,
        detailedCategory: response.detailedCategory,
        percent: response.percent,
        image_url: response.image_url,
        distrib_method: response.distrib_method,
        picture_rule_1: response.picture_rule_1,
        picture_rule_2: response.picture_rule_2,
        picture_rule_3: response.picture_rule_3,
        authentication_way: response.authentication_way,
        custom_picture_rule_1: response.custom_picture_rule_1,
        custom_picture_rule_2: response.custom_picture_rule_2,
        custom_picture_rule_3: response.custom_picture_rule_3,
        plan_period: response.plan_period,
        picture_time: response.picture_time,
        createdAt: Date.now(),
        is_custom: response.is_custom,
        plan_start_day: response.plan_start_day,
        bet_money: response.bet_money,
        status: 'waiting',
        is_public: response.is_public,
    }).then((temp_plan) => {
            user.findAndCountAll({
                where: {
                    nickname: watchersList
                }
            }).then((watch_users) => {
                watch_users.rows.map((user) => {
                    point.create({
                        user_id: 1,
                        class: 'challenge',
                        amount: 3000,
                        status: 'waiting'
                    });
                    watcher.create({
                        user_id: user.dataValues.id,
                        plan_id: temp_plan.id,
                        createdAt: Date.now(),
                    }).then(() => {
                        pushService.handlePushTokens(temp_plan.title + '의 감시가 시작되었습니다!',
                            user.dataValues.deviceToken);
                    }).catch(err => {
                        console.log(err);
                        res.sendStatus(500);
                    });
                });
                res.sendStatus(200);

            }).catch(err => {
                console.log(err);
                res.sendStatus(500);
            });
        }
    )
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });

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

    let today = new Date();
    let startdate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let enddate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate()+1);
    let time = '09:00:00';
    let startTime = startdate + ' ' + time;
    let endTime = enddate + ' ' + time;
    plan.findAndCountAll({
        include: [
            {
                model: user
            },{
            model: daily_authentication
            }],
        where: {
            user_id: req.params.user_id
        },
        order: [['updatedAt', 'desc'], ['id', 'desc']]
    }).then((plans) => {
        daily_authentication.findAndCountAll({
            where:{
                [Op.or]: [{createdAt:{[Op.between]: [startTime,endTime]}}]
            }
        }).then(daily_authentications =>{

            plan_ids = [];
            plans.rows.map(plan_item=>{plan_ids.push(plan_item.id)});
            daily_auth_ids =[];
            daily_authentications.rows.map(daily_auth_item =>{daily_auth_ids.push(daily_auth_item.plan_id)});

            for(let i=0; i<plan_ids.length; i++){
                if(daily_auth_ids.includes(plan_ids[i])){
                    plans.rows[i].dataValues['today_auth']=true
                }else{
                    plans.rows[i].dataValues['today_auth']=false
                }
            }

            console.log(plans.rows[1].dataValues);
            res.send(plans);
        }).catch(err =>{
            res.send(plans);
        })
        // res.send(plans);
    }).catch(err => {
        console.log(err);
        res.send(500)
    })
});


/**
 * @swagger
 * paths:
 *  /plans/watchingAll/{user_id}:
 *    get:
 *      tags:
 *      - plan
 *      summary: "감시중인 플랜 모두"
 *      description: "Returns all 감시중인 plans"
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
router.get('/watchingAll/:user_id', function (req, res) {
    console.log(new Date());

    let watchingPlanIds = [];
    watcher.findAll({
        where: {
            user_id: req.params.user_id
        },
        order: [['updatedAt', 'desc'], ['id', 'desc']]
    }).then((watchers) => {
        watchers.map(temp => {
            watchingPlanIds.push(temp.dataValues.plan_id)
        })

    }).then(() => {
        plan.findAndCountAll({
            include: [{
                model: user
            },{
                model: daily_authentication
            }],
            where: {
                id: watchingPlanIds
            },
            order: [['updatedAt', 'desc'], ['id', 'desc']]
        }).then(plans => {
            res.send(plans);
        })
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    });

    // plan.findAndCountAll({
    //     where: {
    //         user_id: req.params.user_id
    //     }
    // }).then((plans) => {
    //     res.send(plans);
    // }).catch(err => {
    //     console.log(err);
    //     res.send(500)
    // })
});


module.exports = router;
