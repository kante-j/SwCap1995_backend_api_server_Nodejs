var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morganlogger = require('morgan');
const logger = require('./logger');
const expressWinston = require('express-winston');
const graphqlHTTP = require('express-graphql');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoriesRouter = require('./routes/categories');
var friendsRouter = require('./routes/friends');
var plansRouter = require('./routes/plans');
var pointsRouter = require('./routes/points');
var detailedCategoriesRouter = require('./routes/detailedCategories');
var testRouter = require('./routes/test');
var {GraphQLSchema} = require('graphql');
var bodyParser = require('body-parser');

var options = {
    exclude: ["users"]
};
const {generateSchema} = require('sequelize-graphql-schema')(options);

const models = require('./models');

var app = express();
app.disable('etag');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(morganlogger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/categories', categoriesRouter);
app.use('/friends', friendsRouter);
app.use('/test', testRouter);
app.use('/points', pointsRouter);
app.use('/plans', plansRouter);
app.use('/detailedCategories',detailedCategoriesRouter);

app.use('/graphql', graphqlHTTP({
    schema: new GraphQLSchema(generateSchema(models)),
    graphiql: true,
}));

app.use(expressWinston.logger({ // use logger to log every requests
    transports: [logger],
    meta: false, // optional: control whether you want to log the meta data about the request (default to true)
    msg: `{{req.ip}} - {{res.statusCode}} - {{req.method}} - {{res.responseTime}}ms - {{req.url}} - {{req.headers['user-agent']}}`, // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: false, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: true
}));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
//
// app.listen(3000, function() {
//     console.log('RUNNING ON 8080. Graphiql http://localhost:8080/graphql')
// })
module.exports = app;
