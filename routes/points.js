var express = require('express');
var router = express.Router();
const pushService = require('../modules/push');
const {user, point} = require('../models');

router.post('/add', function (req, res) {
    console.log(new Date());

    let response = {
        user_id: req.body.user_id,
        class: req.body.class,
        amount: req.body.amount,
    };

    point.create({
        user_id:response.user_id,
        class:response.class,
        amount: response.amount,
        status: 'accept'
    }).then(result =>{
        user.findOne({
            where:{
                id:response.user_id
            }
        }).then(user_item =>{
            pushService.handlePushTokens(result.amount+'의 💵포인트💵가 충전되었습니다!!',
                user_item.deviceToken, '포인트 충전', 'myPage');
            res.send(200)
        })
    }).catch(err =>{
        console.log(err);
        res.send(500)
    })

});




module.exports = router;
