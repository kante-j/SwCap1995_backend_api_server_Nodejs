var express = require('express');
var router = express.Router();
const {report_judge} = require('../models');
const pushService = require('../modules/push');


router.post('/', function (req, res) {
    console.log(new Date());
    let response = {
        daily_auth_id: req.body.daily_auth_id,
        plan_id: req.body.plan_id,
        status: req.body.status,
    };

    if(response.status !== 'reject')res.sendStatus(500);
    report_judge.findOne({
        where:{
            daily_auth_id: response.daily_auth_id,
            plan_id: response.plan_id
        }
    }).then(item =>{
        if(item != null){
            res.sendStatus(500);
        }else{
            report_judge.create({
                plan_id: response.plan_id,
                daily_auth_id: response.daily_auth_id,
                status:'reject',
                result: '처리중'
            }).then(()=>{
                res.sendStatus(200);
            }).catch(err =>{
                res.sendStatus(500);
            })
        }
    }).catch(err =>{
        console.log(err);
        res.sendStatus(500);
    })

});



module.exports = router;
