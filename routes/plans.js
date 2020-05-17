var express = require('express');
var router = express.Router();

const {user, friend} = require('../models');

router.post('/test', function (req, res) {
    console.log(new Date());

    console.log(req);
});




module.exports = router;
