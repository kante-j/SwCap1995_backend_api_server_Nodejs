var express = require('express');
var router = express.Router();
// var request = require('request');
const crypto = require('crypto');
const {user, friend, point, user_image, daily_authentication} = require('../models');
const secretKey = require('../secretKey');
var bodyParser = require('body-parser');
var sequelize = require('../models').sequelize;
const push = require('../modules/push');
const multer = require("multer");
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const request = require('request').defaults({ encoding: null });

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

const BASE_URL = secretKey.KAIROUS_BASE_URL;
const HEADERS = secretKey.KAIROUS_HEADERS;

const uploadImage = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'swcap1995/user_images',
        acl: 'public-read',
        metadata(req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key(req, file, cb) {
            cb(null, Date.now().toString() + '.png');
        }
    })
});
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



/**
 * @swagger
 * paths:
 *  /users/is_face_detection/{user_id}:
 *    get:
 *      tags:
 *      - user
 *      summary: "해당 유저의 is_face_detection 컬럼 1로 변경"
 *      description: "Returns a status"
 *      produces:
 *      - applicaion/json
 *      parameters:
 *        - name: user_id
 *          in: path
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

const enroll = async (userId, base64) => {
    console.log('유저 아이디', userId);
    const rawResponse = await fetch(`${BASE_URL}enroll`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
            image: base64,
            subject_id: `MySocial_${userId}`,
            gallery_name: 'MyGallery',
        }),
    });
    const content = await rawResponse.json();
    return content;
};

router.post('/face_detection', uploadImage.single('photo'), (req, res)=> {
    console.log(new Date());
    var user_id = req.body.user_id;

    user.findOne({where: {id: user_id}})
        .then((user) => {
            user.update({
               is_face_detection: 1
            }).then(() =>{
                request.get('https://kr.object.ncloudstorage.com/swcap1995/user_images/' + req.file.key, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
                        enroll(user_id, data).then(content =>{
                            console.log(content.images);
                            user_image.create({
                                face_id: content.face_id,
                                user_id: req.body.user_id,
                                image_url: 'https://kr.object.ncloudstorage.com/swcap1995/user_images/' + req.file.key,
                            }).then(() =>{
                                res.sendStatus(200);
                            })
                        }).catch(err =>{
                            console.log(err);
                            res.sendStatus(500);
                        });
                    }
                });

                // user_image.create({
                //     user_id: req.body.user_id,
                //     image_url: 'https://kr.object.ncloudstorage.com/swcap1995/user_images/' + req.file.key,
                // }).then((user_image) =>{
                //     user_image.image_url
                //
                //     request.get(user_image.image_url, function (error, response, body) {
                //         if (!error && response.statusCode == 200) {
                //             data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
                //             enroll(user_id, data).then(content =>{
                //                 console.log(content);
                //                 user_image.update({
                //                     face_id: content.face_id
                //                 })
                //             }).catch(err =>{
                //                 console.log(err);
                //                 res.sendStatus(500);
                //             });
                //         }
                //     });
                //     res.send(200);
                // })
            });
        }).catch(err => {
        console.log(err);
        res.send(500);
    });
});



/**
 * @swagger
 * paths:
 *  /users/is_user:
 *    post:
 *      tags:
 *      - user
 *      summary: "check is user using email"
 *      description: "Returns a status"
 *      produces:
 *      - applicaion/json
 *      parameters:
 *        - name: email
 *          in: body
 *          required: true
 *          schema:
 *            type: object
 *            required:
 *              -email
 *            properties:
 *              email:
 *                type: string
 *
 *      responses:
 *       200:
 *        description: category of column list
 *        schema:
 *          type: string
 */
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


/**
 * @swagger
 * paths:
 *  /users/emailcheck:
 *    post:
 *      tags:
 *      - user
 *      summary: "is email login "
 *      description: "Returns a status"
 *      produces:
 *      - applicaion/json
 *      parameters:
 *        - name: email
 *          in: body
 *          required: true
 *          schema:
 *            type: object
 *            required:
 *              -email
 *            properties:
 *              email:
 *                type: string
 *
 *      responses:
 *       200:
 *        description: category of column list
 *        schema:
 *          type: string
 */
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


/**
 * @swagger
 * paths:
 *  /users/auth_record/{user_id}:
 *    get:
 *      tags:
 *      - user
 *      summary: "해당 유저의 인증 기록"
 *      description: "인증 기록"
 *      produces:
 *      - applicaion/json
 *      parameters:
 *        - name: user_id
 *          in: path
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
// 포인트
router.get('/auth_record/:user_id', function (req, res) {
    console.log(new Date());
    let user_id = req.params.user_id;
    daily_authentication.findAndCountAll({
        where:{
            user_id: user_id,
            status: 'done'
        },
    }).then(daily_auth_items =>{
        const temp_json ={};
        daily_auth_items.rows.map(item =>{
            let date = item.createdAt.toISOString().split('T')[0];
            if(temp_json[date] === undefined){
                temp_json[date] = 1;
            }else{
                temp_json[date] += 1;
            }
        });
        res.send(temp_json);
    })

});

/**
 * @swagger
 * paths:
 *  /users:
 *    post:
 *      tags:
 *      - user
 *      summary: "user 회원가입"
 *      description: "Returns a status"
 *      produces:
 *      - applicaion/json
 *      parameters:
 *       - name: "body"
 *         in: "body"
 *         required: true
 *         schema:
 *           $ref: "#/definitions/user"
 *
 *      responses:
 *       200:
 *        description: category of column list
 *        schema:
 *          type: string
 */
router.post('/', function (req, res) {
    console.log(new Date());
    let salt = Math.round((new Date().valueOf()) * 0.2) + "";

    let response = {
        email: req.body.email,
        interest_category: req.body.interest_category,
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
                    interest_category: response.interest_category,
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
                interest_category: response.interest_category,
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
            interest_category: response.interest_category,
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

/**
 * @swagger
 * paths:
 *  /users/me/{user_id}:
 *    get:
 *      tags:
 *      - user
 *      summary: "내 정보"
 *      description: "Returns a my point"
 *      produces:
 *      - applicaion/json
 *      parameters:
 *        - name: user_id
 *          in: path
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
                friend_id: req.params.user_id,
                isaccept:'accept'
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


/**
 * @swagger
 * paths:
 *  /users/me/points/{user_id}:
 *    get:
 *      tags:
 *      - user
 *      summary: "해당 유저의 points"
 *      description: "Returns a my point"
 *      produces:
 *      - applicaion/json
 *      parameters:
 *        - name: user_id
 *          in: path
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
