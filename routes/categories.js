var express = require('express');
var router = express.Router();

const {category} = require('../models');


router.get('/', function (req, res) {
    console.log(new Date());
    res.redirect('graphql?query={categoryGet{name, description}}');
});

router.get('/image', function (req, res) {
    console.log(new Date());
    res.send('https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg');
});

router.get('/search', function (req, res) {
    console.log(new Date());
    res.send(req.query.query);
});
module.exports = router;