var express = require('express');
var router = express.Router();
const {user, plan, watcher, point, agreement, daily_judge, daily_authentication} = require('../models');

const multer = require("multer");
const multerS3 = require('multer-s3');
const secretKey = require('../secretKey')
const AWS = require('aws-sdk');

const endpoint = new AWS.Endpoint('https://kr.object.ncloudstorage.com');
const region = 'kr-standard';
const access_key = secretKey.ACCESS_KEY;
const secret_key = secretKey.SECRET_KEY;

const s3 = new AWS.S3({
    endpoint: endpoint,
    region: region,
    credentials: {
        accessKeyId : access_key,
        secretAccessKey: secret_key
    },
});

const uploadImage = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'swcap1995/dailyAuthentications',
        acl: 'public-read',
        metadata(req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key(req, file, cb) {
            cb(null, Date.now().toString() + '.png');
        }
    })
});

/**
 * @swagger
 * definitions:
 *  daily_authentication:
 *   type: object
 *   properties:
 *     id:
 *       type: integer
 *       description: agreement id
 *     user_id:
 *       type: string
 *       description: 유저 id
 *     plan_id:
 *       type: string
 *       description: plan id
 *     comment:
 *       type: string
 *       description: 일일 인증 코멘트
 *     status:
 *       type: string
 *       description: daily auth status
 *     image_url:
 *       type: string
 *       description: image url
 */


router.get('/:plan_id',function (req, res) {
    console.log(new Date());

    daily_authentication.findAndCountAll({
        include: [{
            model: daily_judge
        }],
        where:{
           plan_id: req.params.plan_id
        },
        order: [['id', 'desc']]
    }).then((daily_auth) => {
        let reject_count = 0;
        daily_auth.rows.map(daily_auth_item =>{
            if(daily_auth_item.status === 'reject') reject_count++;
        });
        daily_auth['reject_count'] = reject_count;
        daily_auth['count'] = daily_auth.rows.length;
        res.send(daily_auth);
    }).catch(err => {
        console.log(err);
        res.send(500);
    });
});

router.post('/',uploadImage.single('photo'),function (req, res) {
    console.log(new Date());
    let response = {
        user_id: req.body.user_id,
        plan_id: req.body.plan_id,
        status: req.body.status,
        image_url: 'https://kr.object.ncloudstorage.com/swcap1995/dailyAuthentications/'+req.file.key,
        comment: req.body.comment,
    };

    console.log(response);
    daily_authentication.create({
        user_id: response.user_id,
        plan_id: response.plan_id,
        status: response.status,
        image_url: response.image_url,
        comment: response.comment,
    }).then((daily_auth) =>{
        res.sendStatus(200);
    }).catch(err =>{
        console.log(err);
        res.sendStatus(500);
    })
});


module.exports = router;
