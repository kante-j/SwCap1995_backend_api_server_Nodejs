var express = require('express');
var router = express.Router();

const {category} = require('../models');

/**
 * @swagger
 * definitions:
 *  category:
 *   type: object
 *   properties:
 *     id:
 *       type: integer
 *       description: 카테고리 id
 *     name:
 *       type: string
 *       description: 게시글 내용
 *     description:
 *       type: string
 *       description: 게시글 숨김상태여부
 *     image_url:
 *       type: string
 *       description: 게시글 타입
 */


/**
 * @swagger
 * paths:
 *  /categories:
 *    get:
 *      tags:
 *      - category
 *      description: 모든 카테고리를 가져온다.
 *      produces:
 *      - "application/xml"
 *      - "applicaion/json"
 *      responses:
 *       200:
 *        description: category of column list
 *        schema:
 *          type: json
 */
router.get('/', function (req, res) {
    console.log(new Date());
    res.redirect('graphql?query={categoryGet{name, description}}');
});

router.get('/image', function (req, res) {
    console.log(new Date());
    res.send('https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg');
});


/**
 * @swagger
 * paths:
 *  /categories/search/{query}:
 *    get:
 *      tags:
 *      - category
 *      summary: "search category"
 *      description: "Returns a query"
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - name: "query"
 *        in: "path"
 *        required: true
 *        type: "string"
 *
 *      responses:
 *       200:
 *        description: category of column list
 *        schema:
 *          type: string
 */
router.get('/search/:query', function (req, res) {
    console.log(new Date());
    res.send(req.params.query);
});
module.exports = router;