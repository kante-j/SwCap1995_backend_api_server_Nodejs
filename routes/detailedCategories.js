var express = require('express');
var router = express.Router();
const {detailedCategory} = require('../models');

router.get('/', function (req, res, next) {
    console.log(new Date());
    res.redirect('graphql?query={detailedCategoryGet{id,topCategoryNum,detailedCategory}}');
});


router.get('/:category_id', function (req, res) {
    console.log(new Date());

    detailedCategory.findAndCountAll({
        where:{
            topCategoryNum:req.params.category_id
        },
        attributes:['detailedCategory']
    }).then(list =>{
        res.send(list)
    }).catch(err =>{
        console.log(err);
        res.send(500);
    })

});

module.exports = router;
