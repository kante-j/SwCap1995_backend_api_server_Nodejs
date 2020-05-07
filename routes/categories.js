var express = require('express');
var router = express.Router();

const {category} = require('../models');


router.get('/', function (req, res) {
    res.redirect('graphql?query={categoryGet{id,name}}');
});

router.get('/search', function (req, res) {
    res.send(req.query.query);
});
module.exports = router;