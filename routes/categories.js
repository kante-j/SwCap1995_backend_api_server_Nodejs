var express = require('express');
var router = express.Router();

const {category} = require('../models');

/**
 * @swagger
 * definitions:
 *  category:
 *   type: object
 *   required:
 *   properties:
 *     name:
 *       type: string
 *       description: 게시글 제목
 *     boardContent:
 *       type: string
 *       description: 게시글 내용
 *     boardState:
 *       type: boolean
 *       description: 게시글 숨김상태여부
 *     boardType:
 *       type: string
 *       description: 게시글 타입
 */

/**
 * @swagger
 *  /:
 *    get:
 *      tags:
 *      - category
 *      description: 모든 카테고리를 가져온다.
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      responses:
 *       200:
 *        description: category of column list
 *        schema:
 *          type: json
 *          items:
 *           $ref: '#/definitions/boardItem'
 */
router.get('/', function (req, res) {
    console.log(new Date());
    res.redirect('graphql?query={categoryGet{name, description}}');
});


/**
 * @swagger
 *  /image:
 *    get:
 *      tags:
 *      - category
 *      description: 모든 게시글을 가져온다.
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      responses:
 *       200:
 *        description: category of column list
 *        schema:
 *          type: array
 *          items:
 *           $ref: '#/definitions/boardItem'
 */
router.get('/image', function (req, res) {
    console.log(new Date());
    res.send('https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg');
});

router.get('/search', function (req, res) {
    console.log(new Date());
    res.send(req.query.query);
});
module.exports = router;