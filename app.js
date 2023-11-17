const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const Horse = require('./models/horses'); // Check the path to the model file



const connectionString ="mongodb+srv://s564148:0rzNLg5AMhLLIyaJ@cluster0.xoykge7.mongodb.net/?retryWrites=true&w=majority" || process.env.MONGO_CONN;
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));
db.once("open", function () {
  console.log("Connection to DB succeeded");
});
// passport config
// Use the existing connection
// The Account model
var Account =require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var boardRouter = require('./routes/board');
var chooseRouter = require('./routes/choose');
var resourceRouter = require('./routes/resource');
var horsesRouter = require('./routes/horses'); // Import the horses router

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
passport.use(new LocalStrategy(
  function(username, password, done) {
  Account.findOne({ username: username })
  .then(function (user){
  if (err) { return done(err); }
  if (!user) {
  return done(null, false, { message: 'Incorrect username.' });
  }
  if (!user.validPassword(password)) {
  return done(null, false, { message: 'Incorrect password.' });
  }
  return done(null, user);
  })
  .catch(function(err){
  return done(err)
  })
  })
  )
  app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/board', boardRouter);
app.use('/selector', chooseRouter);
app.use('/resource', resourceRouter);
app.use('/horses', horsesRouter); // Use the horses router for /horses routes

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

async function recreateDB() {
  // Delete everything from the Horse model
  await Horse.deleteMany();

  let instance1 = new Horse({ horse_name: 'Midnight Shadow', horse_age: 6, horse_price: 5500 });
  instance1.save().then(doc => {
    console.log("First horse saved");
  }).catch(err => {
    console.error(err);
  });

  let instance2 = new Horse({ horse_name: 'Thunderbolt', horse_age: 5, horse_price: 4200 });
  instance2.save().then(doc => {
    console.log("Second horse saved");
  }).catch(err => {
    console.error(err);
  });

  let instance3 = new Horse({ horse_name: 'Starry Night', horse_age: 4, horse_price: 6800 });
  instance3.save().then(doc => {
    console.log("Third horse saved");
  }).catch(err => {
    console.error(err);
  });
}

let reseed = true;
if (reseed) { recreateDB(); }

module.exports = app;
