var express = require('express');
var router = express.Router();

const {friend} = require('../models');


router.get('/:user_id', function (req, res) {
    res.redirect('query{\n' +
        '  friendGet(where : {\n' +
        '  iuaccept: \"accept\" \n' +
        '    user_id:' + req.params.user_id + '\n' +
        '  }) {\n' +
        '    id,\n' +
        '    user_id,\n' +
        '    friend_id\n' +
        '  }\n' +
        '}');
});

router.get('/', function (req, res) {
    res.redirect('graphql?query={friendGet{id,user_id,friend_id}}');
});


module.exports = router;