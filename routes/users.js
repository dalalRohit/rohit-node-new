const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const hbs=require('hbs');
const _ =require('lodash');
const bcrypt=require('bcryptjs');

//const router=express.Router();

const { check, } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var {authenticate}=require('./../middleware/authenticate');


//app setup
var app=express();
app.use(bodyParser.urlencoded({ extended: false }));

//Models
let User=require('../models/user');

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//GET /
app.get('/',(req,res) => {
  res.render('dashboard',{success:true});
});

//GET /users/login
app.get('/login',(req,res)=>{
    res.render('login',{
        pageTitle:"Login page"
    });
});

// //dashboard page
// app.get('/dashboard',authenticate,(req,res) => {
//     //res.render('dashboard');
//     res.send(req.user);
// });

//POST /users/login
app.post('/login',(req,res)=> {
  var id=req.body.loginid;
  var password=req.body.password;

  //assigning found user to 'user' to pass it along with the route
  var user= User.findByCred(id,password).then( (user) => {
    //res.status(200).send('LoggedIn....');
    //console.log("user loggedIN");
    res.render('dashboard',{user:req.user,success:true,pageTitle:"Dashboard",msg:"You're now logged in!"});
  }).catch( (err) => {
    res.render('login',{error:"No user found! Check credentials once!"});
  });

});

//GET /users/register
app.get('/register',(req,res)=>{
    res.render('register',{
        pageTitle:"Register page"
    });
});

//POST users/register
app.post('/register',[
    check('loginid','LoginID must be atleast 10 chars long').isLength({min:10}),
    check('loginid','LoginID cannot be empty').exists(),
    check('email').isEmail(),
    check('email','EmailID is must!').exists(),
    check('password','Password must be atleast 6 chars long').isLength({min:6}),
    check('password2','Two passwords must match!')
      .custom((value, { req }) => value === req.body.password)

    ],(req,res,next) => {
    const errors = validationResult(req);

    //console.log(errors.mapped());
    if (!errors.isEmpty())
    {   //res.send(errors);
        // console.log(Object.keys(errors));
        res.status(422).json({errors:errors.mapped()});
    }
    const loginid=req.body.loginid;
    const email=req.body.email;
    const password=req.body.password;
    const password2=req.body.password2;

    var body=_.pick(req.body,['loginid','email','password']);
    //NO VALIDATION ERRORS
    var user=new User(body);

    //password hashing
    bcrypt.genSalt(10,(err,salt) => {
      bcrypt.hash(user.password,salt,(err,hash) => {

        if(err)
        {
          return console.log(err);
        }
        //changing plain text password of user doc to newly hashed password
        user.password=hash;

        //saving user with hashed password
        user.save()
        .then( (user) => {
          //res.send('YOU NOW CAN LOGIN');
          // res.send(user);
          return user.generateAuthToken();
        })
        .then( (token) => {
          //redirecting users to login page after succesful registration
          //res.redirect('/users/login').header('x-auth',token);
           res.header('x-auth',token).send(user);
        })
        .catch( (err) => {
          res.status(400).send(err);
        });
      })
    });
});

//global user variable
app.get('*',(req,res,next) => {
  res.locals.user=req.user || null;
  next();
});

// logout
app.get('/logout', function(req, res){
  req.logout();
//   req.session.sessionFlash = {
//     type: 'success',
//     message: 'You are logged out!'
// };
  res.redirect('/users/login');
});


//GET /users/feedback
app.get('/feedback',(req,res) => {
  res.render('feedback',{
    pageTitle:"Feedback page",
    success:true,
    user:req.user
  });
});

module.exports=app;
