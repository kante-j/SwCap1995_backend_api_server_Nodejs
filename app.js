var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const graphqlHTTP = require('express-graphql');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoriesRouter = require('./routes/categories');
var friendsRouter = require('./routes/friends');
var testRouter = require('./routes/test');
var {GraphQLSchema} = require('graphql');
var bodyParser = require('body-parser');

var options = {
    exclude: ["users"]
};
const {generateSchema} = require('sequelize-graphql-schema')(options);

const models = require('./models');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
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

app.use('/graphql', graphqlHTTP({
    schema: new GraphQLSchema(generateSchema(models)),
    graphiql: true,
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
