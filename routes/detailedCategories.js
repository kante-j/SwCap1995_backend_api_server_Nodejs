var express = require('express');
var router = express.Router();
const {detailedCategory} = require('../models');

/**
 * @swagger
 * definitions:
 *  detailedCategory:
 *   type: object
 *   properties:
 *     id:
 *       type: integer
 *       description: 카테고리 id
 *     topCategoryNum:
 *       type: integer
 *       description: top 카테고리 번호
 *     detailedCategory:
 *       type: string
 *       description: 디테일 카테고리
 *     image_url:
 *       type: string
 *       description: 이미지 url
 */


/**
 * @swagger
 * paths:
 *  /detailedCategories:
 *    get:
 *      tags:
 *      - detailedCategory
 *      description: 모든 세부 카테고리를 가져온다.
 *      produces:
 *      - "application/xml"
 *      - "applicaion/json"
 *      responses:
 *       200:
 *        description: category of column list
 *        schema:
 *          type: json
 */
router.get('/', function (req, res, next) {
    console.log(new Date());
    res.redirect('graphql?query={detailedCategoryGet{id,topCategoryNum,detailedCategory,image_url,createdAt,updatedAt}}');
});



/**
 * @swagger
 * paths:
 *  /detailedCategories/{category_id}:
 *    get:
 *      tags:
 *      - detailedCategory
 *      summary: "search category"
 *      description: "Returns a query"
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - name: "category_id"
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
router.get('/:category_id', function (req, res) {
    console.log(new Date());

    detailedCategory.findAndCountAll({
        where:{
            topCategoryNum:req.params.category_id
        },
    }).then(list =>{
        res.send(list)
    }).catch(err =>{
        console.log(err);
        res.send(500);
    })

});

module.exports = router;
