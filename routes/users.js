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

//TODO : 이메일 비밀번호 찾기

router.post('/is_nickname', function (req, res) {
    var nickname = req.body.nickname;

    user.findOne({where: {nickname: nickname}})
        .then((user) =>{
            if(user!=null){
                res.send(500);
                return;
            }else{
                res.send(200);
                return;
            }
        })
});

router.post('/is_user', function (req, res) {
    var email = req.body.email;
    console.log("11")
    var returnUID ={};

    user.findOne({where: {email: email}})
        .then((user) =>{

            console.log("asd")
            if(user!=null){
                returnUID['id'] = user.id;
                console.log(returnUID)
                res.send(returnUID);
                // res.send(500);
                return;
            }else{
                res.send(200);
                return;
            }
        })
});

router.post('/emailcheck', function (req, res) {
    var email = req.body.email;

    user.findOne({where: {email: email}})
        .then((user) =>{
            if(user.is_email_login == 1){
                res.send(200);
                return;
            }else{
                res.send(500);
                return;
            }
        })
});

router.post('/', function (req, res) {
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
        }).then(()=>{
        console.log("유저 생성 완료 : "+response.email);
            if (is_user == false){
                user.create({
                    email: response.email,
                    // password: response.password,
                    sex: response.sex,
                    age: response.age,
                    created_at: response.created_at,
                    nickname : response.nickname,
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
                nickname : response.nickname,
                created_at: response.created_at,
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
            created_at: response.created_at,
            nickname : response.nickname,
            is_face_detection: response.is_face_detection,
            weight: response.weight,
            is_email_login: response.is_email_login,
        })
    }


    res.redirect("/")

});




module.exports = router;
