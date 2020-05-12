var express = require('express');
var router = express.Router();

const secretKey = require('../secretKey')
const AWS = require('aws-sdk');

const endpoint = new AWS.Endpoint('https://kr.object.ncloudstorage.com');
const region = 'kr-standard';
const access_key = secretKey.ACCESS_KEY;
const secret_key = secretKey.SECRET_KEY;

const S3 = new AWS.S3({
    endpoint: endpoint,
    region: region,
    credentials: {
        accessKeyId : access_key,
        secretAccessKey: secret_key
    }
});

const bucket_name = 'swcap1995';
const local_file_path = '/tmp/test.txt';

router.get('/', function (req,res) {
    
})

module.exports = router;