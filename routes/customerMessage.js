var express = require('express');
var router = express.Router();
const {customer_message} = require('../models');


/**
 * @swagger
 * definitions:
 *  customer_message:
 *   type: object
 *   properties:
 *     id:
 *       type: integer
 *       description: customer message id
 *     user_id:
 *       type: integer
 *       description: user id
 *     title:
 *       type: string
 *       description: customer title
 *     message:
 *       type: string
 *       description: customer message
 *     nickname:
 *       type: string
 *       description: customer message
 *     message_type:
 *       type: string
 *       description: customer message_type
 *     email:
 *       type: string
 *       description: customer email
 *     answer:
 *       type: string
 *       description: customer answer
 */

/**
 * @swagger
 * paths:
 *  /customer_message/{user_id}:
 *    get:
 *      tags:
 *      - customer_message
 *      summary: "customer_message search by user id"
 *      description: "Returns a my customer_message"
 *      produces:
 *      - applicaion/json
 *      parameters:
 *        - name: user_id
 *          in: path
 *          required: true
 *          schema:
 *            type: object
 *            required:
 *              -user_id
 *            properties:
 *              user_id:
 *                type: integer
 *
 *      responses:
 *       200:
 *        description: category of column list
 *        schema:
 *          type: string
 */
router.get('/:user_id', function (req, res) {
    console.log(new Date());
    let user_id = req.params.user_id;

    customer_message.findAndCountAll({
        where:{
            user_id: user_id
        }
    }).then(customer_messages =>{
        res.send(customer_messages)
    }).catch(err =>{
        res.sendStatus(500)
    })
});



/**
 * @swagger
 * paths:
 *  /customer_message/inquiry:
 *    post:
 *      tags:
 *      - customer_message
 *      summary: "customer message create"
 *      description: "Returns a status"
 *      produces:
 *      - applicaion/json
 *      parameters:
 *      - name: "body"
 *        in: "body"
 *        required: true
 *        schema:
 *          $ref: "#/definitions/customer_message"
 *
 *      responses:
 *       200:
 *        description: category of column list
 *        schema:
 *          type: string
 */
router.post('/inquiry',function (req, res) {
    console.log(new Date());
    let response = {
        user_id: req.body.user_id,
        title: req.body.title,
        message: req.body.message,
        message_type: req.body.message_type,
        email: req.body.email,
    };

    customer_message.create({
        user_id: response.user_id,
        email: response.email,
        title: response.title,
        message: response.message,
        message_type: response.message_type,
    }).then(customer_message =>{
        res.sendStatus(200);
    }).catch(err =>{
        console.log(err);
        res.sendStatus(500);
    });

});

module.exports = router;
