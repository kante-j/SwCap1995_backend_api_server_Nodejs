// var winston = require('winston');
//
// Papertrail = require('winston-papertrail').Papertrail;
// logger = new winston.createLogger({
//     transports: [
//         new winston.transports.Papertrail({
//             host: 'logs2.papertrailapp.com',
//             port: 14880
//         })
//     ]
// });
//
// logger.info('this is my message');
var winston = require('winston');

//
// Requiring `winston-papertrail` will expose
// `winston.transports.Papertrail`
//
require('winston-papertrail').Papertrail;

var logger = new winston.createLogger({
    transports: [
        new winston.transports.Papertrail({
            host: 'logs2.papertrailapp.com',
            port: 14880,
            logFormat: function(level, message) {
                return '<<<' + level + '>>> ' + message;
            }
        })
    ]
});

logger.info('this is my message');

module.exports = logger;