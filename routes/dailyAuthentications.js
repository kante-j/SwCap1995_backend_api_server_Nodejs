var express = require('express');
var router = express.Router();
const {user, plan, watcher, point, agreement, daily_authentication} = require('../models');


router.get('/:plan_id',function (req, res) {
    console.log(new Date());

    daily_authentication.findAndCountAll({
        include: [{
            model: plan,
            as: "plan",
            attributes: [],
        }],
        where:{
           plan_id: req.params.plan_id
        },
    }).then((daily_auth) => {
        res.send(daily_auth);
    }).catch(err => {
        console.log(err);
        res.send(500);
    });
});

router.post('/',function (req, res) {
    console.log(new Date());
    let response = {
        user_id: req.body.user_id,
        plan_id: req.body.plan_id,
        status: req.body.status,
        image_url: req.body.image_url,
        comment: req.body.comment,
    };

    console.log(response);
    daily_authentication.create({
        user_id: response.user_id,
        plan_id: response.plan_id,
        status: response.status,
        image_url: response.image_url,
        comment: response.comment,
    }).then((daily_auth) =>{

        res.sendStatus(200);
    }).catch(err =>{
        console.log(err);
        res.sendStatus(500);
    })
});


module.exports = router;
