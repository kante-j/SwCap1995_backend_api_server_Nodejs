var express = require('express');
var router = express.Router();
const {user, friend, daily_judge, daily_authentication} = require('../models');

router.get('')

router.post('/', function (req, res) {
    console.log(new Date());
    let response = {
        user_id: req.body.user_id,
        daily_auth_id: req.body.daily_auth_id,
        is_correct: req.body.is_correct,
        emoticon: req.body.emoticon,
        comment: req.body.comment
    };

    daily_judge.create({
        user_id: response.user_id,
        daily_auth_id: response.daily_auth_id,
        is_correct: response.is_correct,
        emoticon: response.emoticon,
        comment: response.comment
    }).then(daily_judge =>{

        res.sendStatus(200);
    }).catch(err =>{
        console.log(err);
        res.sendStatus(500);
    });
});

module.exports = router;
