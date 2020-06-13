var express = require('express');
var router = express.Router();
const {notice} = require('../models');
const sequelize = require('sequelize');
const Op = sequelize.Op;

router.get('/', function (req, res) {
    notice.findAndCountAll({
        order: [['createdAt', 'desc']],
    }).then(items => {
        res.send(items);
    })
});

router.get('/recent', function (req, res) {
    notice.findOne({
        order: [['createdAt', 'desc']],
    }).then(item=>{
        res.send(item);
    }).catch(err =>{
        console.log(err);
        res.send(500);
    })
});
module.exports = router;
