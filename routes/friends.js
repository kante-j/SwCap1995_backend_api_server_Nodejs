var express = require('express');
var router = express.Router();

const {friend} = require('../models');
const {user} = require('../models/user');


// router.get('/', function (req, res) {
//     res.redirect('graphql?query={friendGet{id,user_id,friend_id}}');
// });

router.get('/list/:user_id', function (req, res) {

    console.log("Qweqwe");
    friend.findAll({where:{
        user_id: req.params.user_id
        }}).then((friend) =>{
            console.log(friend)
    }).catch(err =>{
        console.log(err);
    });
    console.log("Qweqwe11");

    // res.redirect('query{\n' +
    //     '  friendGet(where : {\n' +
    //     '  iuaccept: \"accept\" \n' +
    //     '    user_id:' + req.params.user_id + '\n' +
    //     '  }) {\n' +
    //     '    id,\n' +
    //     '    user_id,\n' +
    //     '    friend_id\n' +
    //     '  }\n' +
    //     '}');
});


// router.get('/:user_id', function (req, res) {
//
//
//
//     res.redirect('query{\n' +
//         '  friendGet(where : {\n' +
//         '  iuaccept: \"accept\" \n' +
//         '    user_id:' + req.params.user_id + '\n' +
//         '  }) {\n' +
//         '    id,\n' +
//         '    user_id,\n' +
//         '    friend_id\n' +
//         '  }\n' +
//         '}');
// });





module.exports = router;