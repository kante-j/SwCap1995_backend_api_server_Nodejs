const {user, plan, friend, watcher, daily_judge, daily_authentication} = require('../models');

const sequelize = require("sequelize");
const Op = sequelize.Op;

// 일일 인증을 하고나서 하루가 지났을 때
// daily_judge가 watcher로 참여된 사람의 수의 절반 이상이고
// daily_judge의 is_accept가 감시로 참여한 사람의 수의절반 이상이면
// daily_authentication을 done으로 바꾼다.
// 절반 이하면 reject
// daily_judge가 watcher로 참여된 사람의 수의 절반 이하이면 무효

// daily_authentication.findAll({
//     where:{
//         [Op.or]: [{createdAt:{[Op.gt]: [startTime]}}]
//     }
// }).then(items =>{
//     console.log(items)
// })

'use strict';
module.exports = () =>{
    function formatDate(date){
        return date.getFullYear() + '년'+
            (date.getMonth() +1)+'월'+
            date.getDate() +'일'+
            date.getHours() +'시'
    }
    let date = new Date();
    function test(){

        console.log(formatDate(date));
    }
};
