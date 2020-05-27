var express = require('express');
var router = express.Router();

const {plan_template} = require('../models');

router.get('/', function (req, res) {
    console.log(new Date());

    plan_template.findAndCountAll({
        attributes: ['id', 'detailedCategory', 'main_rule', 'sub_rule_1', 'sub_rule_2', 'sub_rule_3', 'authentication_way']
    }).then(plan_template => {
            res.send(plan_template);
        }
    ).catch(err => {
        console.log(err);
        res.sendStatus(500);
    })

});


module.exports = router;
