// var dotenv = require('dotenv').config();
// var createError = require('http-errors');
// var express = require('express');
// const async = require('async');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// const helper = require('./utilities/helper');
// const mongoose = require('mongoose');

// // var indexRouter = require('./routes/index');
// // var usersRouter = require('./routes/users');

// var app = express();
// mongoose.set('runValidators', true);
// mongoose.set('strictQuery', false);
// mongoose.connect(process.env.MONGO_URI);
// mongoose.connection.once('open', () => {
//   console.log("connect");
// }).on('error', (error) => {
//   console.log(error);
// })
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// // app.use('/', indexRouter);
// // app.use('/users', usersRouter);

// const adminPaths = [
//   { path: '/auth', routesFile: 'auth' },

// ]
// adminPaths.forEach((adminPaths) => {
//   app.use('/admin' + adminPaths.path, require('./routes/admin/' + adminPaths.routesFile));
// });

// console.log("pass->", helper.passwordEncryptor("12345"));
// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;


var dotenv = require('dotenv').config();
var express = require('express');
const cors = require('cors');
const async = require('async');
var axios = require('axios');
var path = require('path');
const helper = require('./utilities/helper');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
app.use(logger('dev'));
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.set('runValidators', true);
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI);
mongoose.connection.once('open', () => {
  console.log("connect");
}).on('error', (error) => {
  console.log(error);
})

const adminPaths = [
  { path: '/auth', routesFile: 'auth' },
  { path: '/role', routesFile: 'role' },
  { path: '/lead', routesFile: 'lead' },
  { path: '/school', routesFile: 'school' },
  { path: '/upload', routesFile: 'upload' },
]
const superadmin = [
  { path: '/auth', routesFile: 'auth' },
  { path: '/role', routesFile: 'role' },
  { path: '/addacademicyear', routesFile: 'addacademicyear' },
  { path: '/addbranch', routesFile: 'addbranch' },
  { path: '/section', routesFile: 'section' },
  { path: '/class', routesFile: 'class' },
  { path: '/subject', routesFile: 'subject' },
  { path: '/student', routesFile: 'student' },
  { path: '/teacher', routesFile: 'teacher' },
  { path: '/board', routesFile: 'board' },
  { path: '/day', routesFile: 'day' },
  { path: '/medium', routesFile: 'medium' },
  { path: '/semester', routesFile: 'semester' },
  { path: '/standard', routesFile: 'standard' },
  { path: '/stream', routesFile: 'stream' },
  { path: '/timetable', routesFile: 'timetable' },
  { path: '/attendancestudent', routesFile: 'attendancestudent' },
  { path: '/attendenceteacher', routesFile: 'attendenceteacher' },
  { path: '/holiday', routesFile: 'holiday' },
  { path: '/examtype', routesFile: 'examtype' },
  { path: '/exam', routesFile: 'exam' },
  { path: '/feestype', routesFile: 'feestype' },
  { path: '/fees', routesFile: 'fees' },
  { path: '/notice', routesFile: 'notice' },
]

adminPaths.forEach((adminPaths) => {
  app.use('/admin' + adminPaths.path, require('./routes/admin/' + adminPaths.routesFile));
});
superadmin.forEach((superdminPaths) => {
  app.use('/superadmin' + superdminPaths.path, require('./routes/superadmin/' + superdminPaths.routesFile));
});
// console.log("pass->", helper.passwordEncryptor("12345"));
module.exports = app;