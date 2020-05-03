var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const {user} = require('../models');
const secretKey = require('../secretKey');
var bodyParser = require('body-parser');
var sequelize = require('../models').sequelize;

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

router.get('/', function (req, res, next) {
    res.redirect('graphql?query={userGet{id,email}}');
});

router.post('/', function (req, res) {
    let salt = Math.round((new Date().valueOf()) * Math.random()) + "";

    let response = {
        email: req.body.email,
        // password: crypto.createHash("sha256").update(req.body.password + salt).digest("hex"),
        password: encrypt(req.body.password),
        sex: req.body.sex,
        age: req.body.age,
        created_at: Date.now(),
        is_face_detection: false,
        weight: 1,

    };

    var is_user = false;
    user.findOne({where: {email: response.email}})
        .then((user) => {
            if (user != null) {
                console.log("유저가 이미 있습니다.")
                is_user = true;
            }
        }).then(()=>{
            if (is_user == false){
                user.create({
                    email: response.email,
                    password: response.password,
                    sex: response.sex,
                    age: response.age,
                    created_at: response.created_at,
                    is_face_detection: response.is_face_detection,
                    weight: response.weight})
            }
        }
    )
        .catch(err => {
            user.create({
                email: response.email,
                password: response.password,
                sex: response.sex,
                age: response.age,
                created_at: response.created_at,
                is_face_detection: response.is_face_detection,
                weight: response.weight

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
            password: response.password,
            sex: response.sex,
            age: response.age,
            created_at: response.created_at,
            is_face_detection: response.is_face_detection,
            weight: response.weight
        })
    }

    // user.findOrCreate({where: {email: response.email}})
    //     .spread((user, created) => {
    //         console.log(user.get({
    //             plain: true
    //         }))
    //         console.log(created)
    //     })

    // if(is_user == false) {
    //     user.create({
    //         email: response.email,
    //         password: response.password,
    //         sex: response.sex,
    //         age: response.age,
    //         created_at: response.created_at,
    //         is_face_detection: response.is_face_detection,
    //         weight: response.weight
    //
    //     }).then(result => {
    //         console.log("유저 생성 완료");
    //     }).catch(err => {
    //         console.log("유저 생성 실패");
    //         console.log(err);
    //     });
    // }


    // console.log(response);

    res.redirect("/")

});

module.exports = router;
