var express = require('express');
var router = express.Router();

const {user, friend} = require('../models');
// const {user} = require('../models');


router.get('/', function (req, res) {
    console.log(new Date());
    res.redirect('graphql?query={friendGet{id,user_id,friend_id}}');
});


router.get('/:user_id', function (req, res) {
    console.log(new Date());

    user.findAndCountAll({
        include: [{
            model: friend,
            as: "friend",
            attributes: [],
            where: {
                user_id: req.params.user_id,
                isaccept: 'accept'
            },
        }],

    }).then((user) => {
        res.send(user);
    }).catch(err => {
        console.log(err);
        res.send(500);
    });
});


router.get('/waiting/:user_id', function (req, res) {
    console.log(new Date());

    friend.findAndCountAll({
        include:[{
            model: user,
            as: 'user',
        }],
        where:{
            friend_id: req.params.user_id,
            isaccept: 'waiting'
        },
    }).then((user) => {
        res.send(user);
    }).catch(err => {
        console.log(err);
        res.send(500);
    });

    // user.findAndCountAll({
    //     include: [{
    //         model: friend,
    //         as: "friend",
    //         attributes: ['user_id', 'friend_id', 'isaccept'],
    //         where: {
    //             // friend_id: req.params.user_id,
    //             isaccept: 'waiting'
    //         },
    //     }],
    //     where:{
    //         id: 'friend.friend_id'
    //     }
    // }).then((user) => {
    //     res.send(user);
    // }).catch(err => {
    //     console.log(err);
    //     res.send(500);
    // });
});


router.put('/add', function (req, res) {
    console.log(new Date());
    let response = {
        user_id: req.body.user_id,
        target_nickname: req.body.nickname
    };

    user.findOne({
        where: {
            nickname: response.target_nickname
        }
    }).then((target_user) => {
        //친구목록에 찾아서 없으면 friends 테이블에 추가
        friend.findOne({
            where:{
                user_id: response.user_id,
                friend_id: target_user.id
            }
        }).then((user) =>{
            console.log("친구목록에 존재합니다!")
        }).catch(err =>{
            console.log("친구목록 생성 완료")
            friend.create({
                user_id: response.user_id,
                friend_id: target_user.id,
                isaccept: 'waiting',
                created_at: Date.now(),
            });
            res.send(200);
        });

    }).catch((err) => {
        console.log(err);
        res.send(500)
    });
});


router.patch('/response', function (req, res) {
    console.log(new Date());
    let response = {
        user_id: req.body.user_id,
        target_nickname: req.body.nickname,
        is_accept: req.body.is_accept
    };
    user.findOne({
        where: {
            nickname: response.target_nickname
        }
    }).then((target_user) => {
        friend.findOne({
            where: {
                friend_id: response.user_id,
                user_id: target_user.id
            }
            //친구 목록을 수락하면
        }).then((friend_one)=>{
            console.log(friend_one)
            friend_one.update({
                isaccept: response.is_accept
            });
            friend.create({
                friend_id: target_user.id,
                user_id: response.user_id,
                isaccept: 'accept',
                created_at: Date.now(),
            });
            res.send(200);
        }).catch((err)=>{
            console.log(err);
            res.send(500);
        })
    }).catch((err) => {
        console.log(err);
        res.send(500);
    });
});


module.exports = router;