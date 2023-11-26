const express = require('express');
const passport = require('passport');
const router = express.Router();
const Account = require('../models/account');

router.get('/', function (req, res) {
  res.render('index', { title: 'Horse App', user: req.user });
  console.log(req.user);
});

router.get('/register', function(req, res) {
  res.render('register', { title: 'Horse App Registration'});
});

router.post('/register', function(req, res) {
  Account.findOne({ username: req.body.username })
    .then(function (user) {
      if (user) {
        console.log("exists " + req.body.username);
        return res.render('register', { title: 'Registration', message: 'Existing User', account: req.body.username });
      }

      let newAccount = new Account({ username: req.body.username });
      Account.register(newAccount, req.body.password, function(err, user) {
        if (err) {
          console.log("db creation issue " + err);
          return res.render('register', { title: 'Registration', message: 'Database error', account: req.body.username });
        }

        console.log('Success, redirect');
        res.redirect('/');
      });
    })
    .catch(function (err) {
      console.error(err);
      return res.render('register', { title: 'Registration', message: 'Registration error', account: req.body.username });
    });
});

router.get('/login', function(req, res) {
  res.render('login', { title: 'Horse App Login', user: req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  if (req.session.toReturn) {
    console.log("Send it back to " + req.session.toReturn);
    res.redirect(req.session.toReturn);
  }
  res.redirect('/');
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/ping', function(req, res) {
  res.status(200).send("pong!");
});

module.exports = router;
