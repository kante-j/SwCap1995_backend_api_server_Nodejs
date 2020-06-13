var express = require('express');
var router = express.Router();
const pushService = require('../modules/push');
const {user, friend} = require('../models');
// const {user} = require('../models');

/**
 * @swagger
 * definitions:
 *  friend:
 *   type: object
 *   properties:
 *     id:
 *       type: integer
 *       description: friend id
 *     user_id:
 *       type: string
 *       description: 유저 id
 *     friend_id:
 *       type: string
 *       description: 친구 id
 *     is_accept:
 *       type: string
 *       description: 현재 친구 수락 상태 여부
 */



/**
 * @swagger
 * paths:
 *  /friends:
 *    get:
 *      tags:
 *      - friend
 *      description: 모든 친구목록을 가져온다.
 *      produces:
 *      - "application/xml"
 *      - "applicaion/json"
 *      responses:
 *       200:
 *        description: friends of column list
 *        schema:
 *          type: json
 */
router.get('/', function (req, res) {
    console.log(new Date());
    res.redirect('graphql?query={friendGet{id,user_id,friend_id}}');
});



router.get('/:user_id', function (req, res) {
    console.log(new Date());

    user.findAndCountAll({
        include: [{
            model: friend,
            as: "friend",
            attributes: [],
            where: {
                user_id: req.params.user_id,
                isaccept: 'accept'
            },
        }],

    }).then((user) => {
        res.send(user);
    }).catch(err => {
        console.log(err);
        res.send(500);
    });
});


router.get('/waiting/:user_id', function (req, res) {
    console.log(new Date());

    var list = [];

    friend.findAll({
        where: {
            friend_id: req.params.user_id,
            isaccept: 'waiting'
        }
    }).then(friends => {
        if (friends.length > 0) {
            friends.map((friend) => {
                // console.log(friend.dataValues.user_id);
                list.push(friend.dataValues.user_id)
            });

            if (list.length > 0) {
                user.findAndCountAll({
                    where: {
                        id: list,
                    }
                }).then((user) => {
                    res.send(user);
                }).catch(err => {
                    console.log(err)
                    res.sendStatus(500)
                })
            } else {
                res.sendStatus(500)
            }
        }else{
            let response = {}
            response['count'] = 0;
            response['rows']=[]
            res.send(response)
        }


    }).catch(err => {
        res.send(err);
    });

});

var isEmpty = function (value) {
    if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) {
        return true
    } else {
        return false
    }
};

router.put('/add', function (req, res) {
    console.log(new Date());
    let response = {
        user_id: req.body.user_id,
        target_nickname: req.body.nickname
    };

    user.findOne({
        where: {
            nickname: response.target_nickname
        }
    }).then((target_user) => {
        //친구목록에 찾아서 없으면 friends 테이블에 추가
        friend.findOne({
            where: {
                user_id: response.user_id,
                friend_id: target_user.id
            }
        }).then((user) => {
            console.log(user)
            if (isEmpty(user)) {
                throw new Error();
            }
            console.log("친구목록에 존재합니다!")
        }).catch(err => {
            console.log("친구목록 생성 완료")
            friend.create({
                user_id: response.user_id,
                friend_id: target_user.id,
                isaccept: 'waiting',
                createdAt: Date.now(),
            });
            user.findOne({where: {id: response.user_id}}).then((user) => {
                pushService.handlePushTokens(user.nickname + '님이 친구가 되고싶어합니다😀!',
                    target_user.deviceToken, '친구 요청', 'friend');
            }).then(() => {
                res.send(200)
            }).catch(err => {
                console.log(err);
                res.send(500)
            })

        });

    }).catch((err) => {
        console.log(err);
        res.send(500)
    });
});


router.patch('/response', function (req, res) {
    console.log(new Date());
    let response = {
        user_id: req.body.user_id,
        target_nickname: req.body.nickname,
        is_accept: req.body.is_accept
    };
    user.findOne({
        where: {
            nickname: response.target_nickname
        }
    }).then((target_user) => {
        friend.findOne({
            where: {
                friend_id: response.user_id,
                user_id: target_user.id
            }
            //친구 목록을 수락하면
        }).then((friend_one) => {
            if(response.is_accept == 'accept'){
                friend_one.update({
                    isaccept: response.is_accept
                });
                friend.create({
                    friend_id: target_user.id,
                    user_id: response.user_id,
                    isaccept: 'accept',
                    createdAt: Date.now(),
                });

                user.findOne({where: {id: response.user_id}}).then((user) => {
                    pushService.handlePushTokens(user.nickname + '님과 친구가 되었습니다!',
                        target_user.deviceToken, '친구 수락', 'friend');
                }).then(() => {
                    res.send(200)
                }).catch(err => {
                    console.log(err);
                    res.send(500)
                })
            }else{
                friend_one.update({
                    isaccept: response.is_accept
                });
            }

            res.send(200);
        }).catch((err) => {
            console.log(err);
            res.send(500);
        })
    }).catch((err) => {
        console.log(err);
        res.send(500);
    });
});


module.exports = router;
