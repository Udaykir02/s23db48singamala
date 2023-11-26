const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Horse = require('./models/horses');
const Account = require('./models/account');

const connectionString = "mongodb+srv://s564148:0rzNLg5AMhLLIyaJ@cluster0.xoykge7.mongodb.net/?retryWrites=true&w=majority" || process.env.MONGO_CONN;
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));
db.once("open", function () {
  console.log("Connection to DB succeeded");
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    Account.findOne({ username: username })
      .then(function (user) {
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }

        // Use the authenticate method provided by passport-local-mongoose
        user.authenticate(password, function(err, isMatch) {
          if (err) {
            return done(err);
          }

          if (!isMatch) {
            return done(null, false, { message: 'Incorrect password.' });
          }

          return done(null, user);
        });
      })
      .catch(function (err) {
        return done(err);
      });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  Account.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err);
    });
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var boardRouter = require('./routes/board');
var chooseRouter = require('./routes/choose');
var resourceRouter = require('./routes/resource');
var horsesRouter = require('./routes/horses');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
app.use('/horses', horsesRouter);

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
