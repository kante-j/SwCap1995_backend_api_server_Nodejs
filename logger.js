// // var winston = require('winston');
// //
// // Papertrail = require('winston-papertrail').Papertrail;
// // logger = new winston.createLogger({
// //     transports: [
// //         new winston.transports.Papertrail({
// //             host: 'logs2.papertrailapp.com',
// //             port: 14880
// //         })
// //     ]
// // });
// //
// // logger.info('this is my message');
// var winston = require('winston');
//
// //
// // Requiring `winston-papertrail` will expose
// // `winston.transports.Papertrail`
// //
// var Papertrail = require('winston-papertrail').Papertrail;
// var logger;
// var consoleLogger = new winston.transports.Console({
//     level: 'debug',
//     timestamp: function() {
//         return new Date().toString();
//     },
//     colorize: true
// });
// var logger2 = new (winston.createLogger)({
//     transports: [
//         new (winston.transports.Console)({ json: false, timestamp: true }),
//         new winston.transports.File({ filename: __dirname + '/debug.log', json: false })
//     ],
//     exceptionHandlers: [
//         new (winston.transports.Console)({ json: false, timestamp: true }),
//         new winston.transports.File({ filename: __dirname + '/exceptions.log', json: false })
//     ],
//     exitOnError: false
// });
//
// var ptTransport = new Papertrail({
//     host: 'logs2.papertrailapp.com',
//     port: 14880,
//     hostname: 'planA',
//     levels: ['debug','info','warn','error'],
//     logFormat: function(level, message) {
//         return '[' + level + '] ' + message;
//     }
// });
//
//
// ptTransport.on('error', function(err) {
//     logger && logger.error(err);
// });
//
// ptTransport.on('connect', function(message) {
//     logger && logger.info(message);
// });
//
// var logger = new winston.createLogger({
//     levels:{
//         debug: 0,
//         info: 1,
//         warn: 2,
//         error: 3
//     },
//     transports:[
//         consoleLogger,
//         ptTransport
//     ]
//     // transports: [
//     //     new winston.transports.Papertrail({
//     //         host: 'logs2.papertrailapp.com',
//     //         port: 14880,
//     //         level: 'debug',
//     //         logFormat: function(level, message) {
//     //             return '<<<' + level + '>>> ' + message;
//     //         }
//     //     })
//     // ]
// });
// module.exports = logger2;

const winston = require('winston');

require('winston-papertrail').Papertrail;
var logger = new winston.transports.Papertrail({
    host: 'logs2.papertrailapp.com', // you get this from papertrail account
    port: 14880, //you get this from papertrail account
    handleExceptions: true
});
module.exports = logger;