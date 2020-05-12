var express = require('express');
var router = express.Router();

const {user, friend} = require('../models');
// const {user} = require('../models');


router.get('/', function (req, res) {
    console.log(Date.now());
    res.redirect('graphql?query={friendGet{id,user_id,friend_id}}');
});


router.get('/:user_id', function (req, res) {
    console.log(Date.now());

    console.log("Qweqwe");

    user.findAndCountAll({
        include: [{
            model: friend,
            as: "friend",
            attributes: ['user_id', 'friend_id', 'isaccept'],
            where: {
                user_id: req.params.user_id,
            },
        }],

    }).then((user) => {
        res.send(user);
    }).catch(err => {
        console.log(err);
        res.send(500);
    });
});


router.put('/add', function (req, res) {
    console.log(Date.now());
    let response = {
        user_id: req.body.user_id,
        target_nickname: req.body.nickname
    };

    user.findOne({
        where: {
            nickname: response.target_nickname
        }
    }).then((target_user) => {
        friend.create({
            user_id: response.user_id,
            friend_id: target_user.id,
            isaccept: 'waiting',
            created_at: Date.now(),
        })
        res.send(200)
    }).catch((err) => {
        console.log(err);
        res.send(500)
    });
});


router.patch('/response', function (req, res) {
    console.log(Date.now());
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
                user_id: response.user_id,
                friend_id: target_user.id
            }
        }).then((friend)=>{
            friend.update({
                isaccept: response.is_accept
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