var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

const{forwardAuth} = require('../config/auth');

//import user schema
const User = require('../models/UserScema');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Halaman login
router.get('/login', forwardAuth,function(req, res, next) {
  res.render('login', { title: 'Halaman Login' });
});

// Halaman login
router.post('/login', function(req, res, next) {
  const { email, password} = req.body;
  let errors = [];
  if(!email || !password ){
    errors.push({msg:"Please enter all fields"});
    console.log('Please enter all fields');
  }
  if(password.length < 6){
    errors.push({msg:"Password must be at least 6 characters"});
    console.log('Password must be at least 6 characters');
  }
  if(errors.length > 0){
    res.render('login', {
      errors: errors,
      email: email,
      password: password,
    });
  }
  else{
    passport.authenticate('local', { successRedirect: '/',
                                     failureRedirect: '/login',
                                     failureFlash: true                                
                                    })(req, res, next);
  }
});


// Halaman register
router.get('/register', forwardAuth,function(req, res, next) {
  res.render('register', { title: 'Halaman Register' });
});

// post register
router.post('/register', forwardAuth,function(req, res, next) {
  const { name, email, password,password2} = req.body;
  console.log(req.body);

  let errors = [];
  if(!name || !email || !password || !password2){
    errors.push({msg:"Please enter all fields"});
    console.log('Please enter all fields');
  }
  if(password != password2){
    errors.push({msg:"Password do not match"});
    console.log('Password do not match');
  }
  if(password.length < 6){
    errors.push({msg:"Password must be at least 6 characters"});
    console.log('Password must be at least 6 characters');
  }
  if(errors.length > 0){
    res.render('register', {
      errors: errors,
      name: name,
      email: email,
      password: password,
      password2: password2
    });
  }
  else{
    User.findOne({email: email})
    .then(user => {
      if(user){
        errors.push({msg:"Email already exists"});
        console.log('Email already exists');
        res.render('register', {
          errors: errors,
          name: name,
          email: email,
          password: password,
          password2: password2
        });
      }
      else{
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
        newUser.save()
        .then(user => {
          console.log(user);
          console.log('Successfully registered');
          res.redirect('/auth/login');
        })
        .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));
  }
});

//Logout
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
