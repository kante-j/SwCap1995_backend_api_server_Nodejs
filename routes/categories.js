var express = require('express');
var router = express.Router();

const {category} = require('../models');


router.get('/', function (req, res, next) {
    res.redirect('graphql?query={categoryGet{id,name}}');
});

module.exports = router;