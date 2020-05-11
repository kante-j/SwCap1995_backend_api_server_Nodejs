var express = require('express');
var router = express.Router();

const models= require('../models');
// const {user} = require('../models');


// router.get('/', function (req, res) {
//     res.redirect('graphql?query={friendGet{id,user_id,friend_id}}');
// });

router.get('/list/:user_id', function (req, res) {

    console.log("Qweqwe");
    // friend.findAll({where:{
    //     user_id: req.params.user_id
    //     }}).then((friend) =>{
    //         console.log(friend[1])
    // }).catch(err =>{
    //     console.log(err);
    // });

    models.friend.findAll({
        include:[{
            model: models.user,
            as: "user",

        }],
        where:{
            user_id: req.params.user_id
        },

        attributes: ['nickname'],
    }).then((user) =>{
        console.log(user);
    });

    // models.user.findAll({
    //     include:[
    //         {
    //             model: models.friend,
    //             as: "friend",
    //             where:{ user_id: req.params.user_id}
    //         },
    //     ],
    //     // where:{
    //     //     'friend':{
    //     //         user_id: req.params.user_id
    //     //     }
    //     // }
    // }).then((user) =>{
    //     console.log(user);
    // });
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