var express = require('express');
var router = express.Router();

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
        status: 'waiting'
    }).then(result =>{
        res.send(200)
    }).catch(err =>{
        console.log(err);
        res.send(500)
    })

});




module.exports = router;
