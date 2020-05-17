var express = require('express');
var router = express.Router();
const multer = require("multer");
const multerS3 = require('multer-s3');

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
const MAX_KEYS = 300;

var params = {
    Bucket: bucket_name,
    MaxKeys: MAX_KEYS
};

let upload = multer({
    storage: multerS3({
        s3: S3,
        bucket: bucket_name,
        key: function (req, file, cb) {
            let extension = path.extname(file.originalname);
            cb(null, Date.now().toString() + extension)
        },
        acl: 'public-read-write',
    })
})

router.post('/upload', upload.single("imgFile"), function(req, res, next){
    let imgFile = req.file;
    res.json(imgFile);
})

router.get('/', function (req,res) {

    (async () => {

        // // List All Objects
        // console.log('List All In The Bucket');
        // console.log('==========================');
        //
        // while(true) {
        //
        //     let response = await S3.listObjectsV2(params).promise();
        //
        //     console.log(`IsTruncated = ${response.IsTruncated}`);
        //     console.log(`Marker = ${response.Marker ? response.Marker : null}`);
        //     console.log(`NextMarker = ${response.NextMarker ? response.NextMarker : null}`);
        //     console.log(`  Object Lists`);
        //     for(let content of response.Contents) {
        //         console.log(`    Name = ${content.Key}, Size = ${content.Size}, Owner = ${content.Owner.ID}`);
        //     }
        //
        //     if(response.IsTruncated) {
        //         params.Marker = response.NextMarker;
        //     } else {
        //         break;
        //     }
        //
        // }

        // List Top Level Folder And Files
        params.Delimiter = '/profile';
        console.log('Top Level Folders And Files In The Bucket');
        console.log('==========================');

        while(true) {

            let response = await S3.listObjectsV2(params).promise();

            console.log(`IsTruncated = ${response.IsTruncated}`);
            console.log(`Marker = ${response.Marker ? response.Marker : null}`);
            console.log(`NextMarker = ${response.NextMarker ? response.NextMarker : null}`);

            console.log(`  Folder Lists`);
            for(let folder of response.CommonPrefixes) {
                console.log(`    Name = ${folder.Prefix}`)
            }

            console.log(`  File Lists`);
            for(let content of response.Contents) {
                console.log(`    Name = ${content.Key}, Size = ${content.Size}, Owner = ${content.Owner.ID}`)
            }


            if(response.IsTruncated) {
                params.Marker = response.NextMarker;
            } else {
                break;
            }

        }

    })();
})


const local_file_path = '/tmp/test.txt';
router.post('/',function (req, res) {

    console.log(req);
    (async () => {

        let object_name = 'category_images/';
        // create folder
        await S3.putObject({
            Bucket: bucket_name,
            Key: object_name
        }).promise();

        object_name = 'sample-object';

        // upload file
        await S3.putObject({
            Bucket: bucket_name,
            Key: object_name,
            ACL: 'public-read',
            Body: fs.createReadStream(req.body.uri)
        }).promise();

    })();

})

module.exports = router;