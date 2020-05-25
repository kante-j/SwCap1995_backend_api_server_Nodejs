var express = require('express');
var router = express.Router();
const multer = require("multer");
const multerS3 = require('multer-s3');
const secretKey = require('../secretKey')
const AWS = require('aws-sdk');


class AWSService{

    endpoint = new AWS.Endpoint('https://kr.object.ncloudstorage.com');
    region = 'kr-standard';
    access_key = secretKey.ACCESS_KEY;
    secret_key = secretKey.SECRET_KEY;

    s3 = new AWS.S3({
        endpoint: this.endpoint,
        region: this.region,
        credentials: {
            accessKeyId : this.access_key,
            secretAccessKey: this.secret_key
        },
    });

    upload = multer({
        storage: multerS3({
            s3: this.s3,
            bucket: 'swcap1995',
            acl: 'public-read',
            metadata(req, file, cb) {
                console.log("metadata"+ file);
                cb(null, {fieldName: file.fieldname});
            },
            key(req, file, cb) {
                console.log("key"+file);
                cb(null, Date.now().toString() + '.png');
            }
        })
    });

}

module.exports = new AWSService();