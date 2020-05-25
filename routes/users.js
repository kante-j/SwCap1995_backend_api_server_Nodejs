var express = require('express');
var router = express.Router();
var request = require('request');
const crypto = require('crypto');
const {user, friend, point} = require('../models');
const secretKey = require('../secretKey');
var bodyParser = require('body-parser');
var sequelize = require('../models').sequelize;
const push = require('../modules/push');
const aws = require('../modules/aws');

/* GET users listing. */

var query = 'select * from Users';

// const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 256 bits (32 characters)
// const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text) {
    var cipher = crypto.createCipheriv(secretKey.algorithm, new Buffer.from(secretKey.password), new Buffer.from(secretKey.vector))
    var crypted = cipher.update(text, 'utf8', 'base64')
    crypted += cipher.final('base64')
    return crypted
}

function decrypt(text) {
    var decipher = crypto.createDecipheriv(secretKey.algorithm, new Buffer.from(secretKey.password), new Buffer.from(secretKey.vector))
    var dec = decipher.update(text, 'hex', 'base64')
    dec += decipher.final('base64')
    return dec
}
/**
 * @swagger
 * definitions:
 *  user:
 *   type: object
 *   properties:
 *     id:
 *       type: integer
 *       description: 유저 id
 *     nickname:
 *       type: string
 *       description: 유저 nickname
 *     email:
 *       type: string
 *       description: 유저 email
 *     is_face_detection:
 *       type: boolean
 *       description: 유저 is_face_detection
 *     is_email_login:
 *       type: boolean
 *       description: 유저 is_email_login
 */


/**
 * @swagger
 * paths:
 *  /users:
 *    get:
 *      tags:
 *      - user
 *      summary: "get users"
 *      description: "Returns a users"
 *      produces:
 *      - applicaion/json
 *
 *      responses:
 *       200:
 *        description: users of column list
 *        schema:
 *          type: string
 */
router.get('/', function (req, res, next) {
    console.log(new Date());
    res.redirect('graphql?query={userGet{id,email}}');
});

//TODO : 이메일 비밀번호 찾기

/**
 * @swagger
 * paths:
 *  /users/is_nickname:
 *    post:
 *      tags:
 *      - user
 *      summary: "get users"
 *      description: "Returns a users"
 *      consumes:
 *      - "application/json"
 *      - "application/xml"
 *      - x-www-form-urlencoded
 *      parameters:
 *      - name: "body"
 *        in: "body"
 *        required: true
 *        schema:
 *          $ref: "#/definitions/user"
 *      produces:
 *      - application/json
 *      responses:
 *       200:
 *        description: is nickname in user table
 *        schema:
 *          type: status code
 */
router.post('/is_nickname', function (req, res) {
    console.log(new Date());
    var nickname = req.body.nickname;

    user.findOne({where: {nickname: nickname}})
        .then((user) => {
            if (user != null) {
                res.send(500);
                return;
            } else {
                res.send(200);
                return;
            }
        })
});




router.get('/is_face_detection/:user_id', function (req, res) {
    console.log(new Date());

    user.findOne({where: {id: req.params.user_id}})
        .then((user) => {
            res.send(user.is_face_detection);
        }).catch(err => {
        console.log(err);
        res.send(500);
    });
});

/**
 * @swagger
 * paths:
 *  /users/face_detection:
 *    post:
 *      tags:
 *      - user
 *      summary: "해당 유저의 is_face_detection 컬럼 1로 변경"
 *      description: "Returns a status"
 *      produces:
 *      - applicaion/json
 *      parameters:
 *        - name: user_id
 *          in: body
 *          required: true
 *          schema:
 *            type: object
 *            required:
 *              -user_id
 *            properties:
 *              user_id:
 *                type: integer
 *
 *      responses:
 *       200:
 *        description: category of column list
 *        schema:
 *          type: string
 */

router.post('/face_detection', aws.upload.single('photo'), (req, res)=> {
    console.log(new Date());
    var user_id = req.body.user_id;

    user.findOne({where: {id: user_id}})
        .then((user) => {
            res.send(user.is_face_detection);
        }).catch(err => {
        console.log(err);
        res.send(500);
    });
});

// 유저이메일로 유저 테이블에 유저가 있는 지 없는지 확인
router.post('/is_user', function (req, res) {
    console.log(new Date());
    var email = req.body.email;
    console.log("11")
    var returnUID = {};

    user.findOne({where: {email: email}})
        .then((user) => {
            if (user != null) {
                returnUID['id'] = user.id;
                console.log(returnUID)
                res.send(returnUID);
                // res.send(500);
                return;
            } else {
                res.send(200);
                return;
            }
        })
});

router.post('/emailcheck', function (req, res) {
    console.log(new Date());
    var email = req.body.email;

    user.findOne({where: {email: email}})
        .then((user) => {
            if (user.is_email_login == 1) {
                res.send(200);
                return;
            } else {
                res.send(500);
                return;
            }
        })
});

router.post('/', function (req, res) {
    console.log(new Date());
    let salt = Math.round((new Date().valueOf()) * Math.random()) + "";

    let response = {
        email: req.body.email,
        // password: crypto.createHash("sha256").update(req.body.password + salt).digest("hex"),
        // password: encrypt(req.body.password),
        sex: req.body.sex,
        age: req.body.age,
        nickname: req.body.nickname,
        created_at: Date.now(),
        is_face_detection: false,
        deviceToken: req.body.deviceToken,
        weight: 1,
        is_email_login: req.body.is_email_login,

    };

    var is_user = false;
    user.findOne({where: {email: response.email}})
        .then((user) => {
            if (user != null) {
                console.log("유저가 이미 있습니다.")
                is_user = true;
            }
        }).then(() => {
            console.log("유저 생성 완료 : " + response.email);
            if (is_user == false) {
                user.create({
                    email: response.email,
                    // password: response.password,
                    sex: response.sex,
                    age: response.age,
                    deviceToken: response.deviceToken,
                    createdAt: response.created_at,
                    nickname: response.nickname,
                    is_face_detection: response.is_face_detection,
                    weight: response.weight,
                    is_email_login: response.is_email_login,
                })
            }
        }
    )
        .catch(err => {
            user.create({
                email: response.email,
                // password: response.password,
                sex: response.sex,
                age: response.age,
                nickname: response.nickname,
                deviceToken: response.deviceToken,
                createdAt: response.created_at,
                is_face_detection: response.is_face_detection,
                weight: response.weight,
                is_email_login: response.is_email_login,

            }).then(result => {
                console.log("유저 생성 완료");
            }).catch(err => {
                console.log("유저 생성 실패");
                console.log(err);
            });
        });
    if (user == null) {
        user.create({
            email: response.email,
            // password: response.password,
            sex: response.sex,
            age: response.age,
            deviceToken: response.deviceToken,
            createdAt: response.created_at,
            nickname: response.nickname,
            is_face_detection: response.is_face_detection,
            weight: response.weight,
            is_email_login: response.is_email_login,
        })
    }


    res.redirect("/")

});

//myPage

router.get('/me/:user_id', function (req, res) {
    console.log(new Date());
    var response = {};
    var myPoint = {};

    // 유저 정보 가져오기
    user.findOne({
        where: {
            id: req.params.user_id
        }
    }).then((me) => {
        response['user_id'] = me.id;
        response['nickname'] = me.nickname;
        response['email'] = me.email;

        //친구 몇명인지
        friend.findAndCountAll({
            where: {
                friend_id: req.params.user_id
            }
        }).then(friendlist => {
            response['friend_count'] = friendlist.count;


            point.findAll({
                where: {
                    user_id: req.params.user_id
                }
            }).then(points => {
                myPoint['challenge_plus'] = 0;
                myPoint['challenge_minus'] = 0;
                myPoint['challenge_total'] = 0;
                myPoint['general_plus'] = 0;
                myPoint['general_minus'] = 0;
                myPoint['general_total'] = 0;

                points.map(point => {
                    if (point.dataValues.amount > 0 && point.dataValues.class == 'challenge') {
                        myPoint['challenge_plus'] += point.dataValues.amount
                    } else if (point.dataValues.amount < 0 && point.dataValues.class == 'challenge') {
                        myPoint['challenge_minus'] += point.dataValues.amount
                    }

                    if (point.dataValues.amount > 0 && point.dataValues.class == 'general') {
                        myPoint['general_plus'] += point.dataValues.amount
                    } else if (point.dataValues.amount < 0 && point.dataValues.class == 'general') {
                        myPoint['general_minus'] += point.dataValues.amount
                    }
                });
                myPoint['challenge_total'] = myPoint['challenge_plus'] + myPoint['challenge_minus']
                myPoint['general_total'] = myPoint['general_plus'] + myPoint['general_minus']

                response['point'] = myPoint;

                res.send(response)
            }).catch(err => {
                res.sendStatus(500);
            })


        })


        // res.send(response)
    })

});


// 포인트
router.get('/me/points/:user_id', function (req, res) {
    console.log(new Date());

    var myPoint = {};
    myPoint['challenge_plus'] = 0;
    myPoint['challenge_minus'] = 0;
    myPoint['challenge_total'] = 0;
    myPoint['general_plus'] = 0;
    myPoint['general_minus'] = 0;
    myPoint['general_total'] = 0;

    point.findAll({
        where: {
            user_id: req.params.user_id
        }
    }).then(points => {
        points.map(point => {
            if (point.dataValues.amount > 0 && point.dataValues.class == 'challenge') {
                myPoint['challenge_plus'] += point.dataValues.amount
            } else if (point.dataValues.amount < 0 && point.dataValues.class == 'challenge') {
                myPoint['challenge_minus'] += point.dataValues.amount
            }

            if (point.dataValues.amount > 0 && point.dataValues.class == 'general') {
                myPoint['general_plus'] += point.dataValues.amount
            } else if (point.dataValues.amount < 0 && point.dataValues.class == 'general') {
                myPoint['general_minus'] += point.dataValues.amount
            }
        });
        myPoint['challenge_total'] = myPoint['challenge_plus'] + myPoint['challenge_minus']
        myPoint['general_total'] = myPoint['general_plus'] + myPoint['general_minus']

        response['point'] = myPoint;
        res.send(myPoint)
    }).catch(err => {
        res.sendStatus(500);
    })
});


module.exports = router;
