var express = require('express');
var router = express.Router();

const models= require('../models');
// const {user} = require('../models');


// router.get('/', function (req, res) {
//     res.redirect('graphql?query={friendGet{id,user_id,friend_id}}');
// });



router.get('/:user_id', function (req, res) {

    console.log("Qweqwe");
    // friend.findAll({where:{
    //     user_id: req.params.user_id
    //     }}).then((friend) =>{
    //         console.log(friend[1])
    // }).catch(err =>{
    //     console.log(err);
    // });

    // models.friend.findAndCountAll({
    //     where:{
    //         user_id: req.params.user_id
    //     },
    //     include:[{
    //         model: models.user,
    //         as: "user",
    //
    //     }],
    //
    // }).then((users) =>{
    //     console.log(JSON.stringify(users));
    // });

    models.user.findAndCountAll({
        include:[{
            model: models.friend,
            as: "friend",
            attributes: ['user_id', 'friend_id'],
            where:{
                user_id: req.params.user_id,
            },
        }],

    }).then((user) =>{
        res.send(user);
    }).catch(err =>{
        res.send(500);
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