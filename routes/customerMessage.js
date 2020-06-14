var express = require('express');
var router = express.Router();
const {customer_message} = require('../models');

router.get('/:user_id', function (req, res) {
    console.log(new Date());
    let user_id = req.params.user_id;

    customer_message.findAndCountAll({
        where:{
            user_id: user_id
        }
    }).then(customer_messages =>{
        res.send(customer_messages)
    }).catch(err =>{
        res.sendStatus(500)
    })
})

router.post('/inquiry',function (req, res) {
    console.log(new Date());
    let response = {
        user_id: req.body.user_id,
        title: req.body.title,
        message: req.body.message,
        message_type: req.body.message_type,
        email: req.body.email,
    };

    customer_message.create({
        user_id: response.user_id,
        email: response.email,
        title: response.title,
        message: response.message,
        message_type: response.message_type,
    }).then(customer_message =>{
        res.sendStatus(200);
    }).catch(err =>{
        console.log(err);
        res.sendStatus(500);
    });

});

module.exports = router;
