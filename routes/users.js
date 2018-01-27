const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const hbs=require('hbs');
const _ =require('lodash');
const router=express.Router();

//app setup
var app=express();
app.use(bodyParser.urlencoded({ extended: false }));

//Models
let User=require('../models/user');

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//GET /users/register
router.get('/register',(req,res)=> {
  res.render('register');
});


// GET /users/login
router.get('/login',(req,res)=> {
  res.render('login');
});
// // //POST users/register
// router.post('/register',[
//     // var loginid=req.body.loginid;
//     // var email=req.body.email;
//     // var password=req.body.password;
//     // var password2=req.body.password2;
//     //
//     // console.log(`${loginid} ${email} ${password}`);
//
//     check('loginid','LoginID must be atleast 10 chars long').isLength({min:10}),
//     check('loginid','LoginID cannot be empty').exists(),
//     check('email').isEmail(),
//     check('email','EmailID is must!').exists(),
//     check('password','Password must be atleast 6 chars long').isLength({min:6}),
//     check('password2','Two passwords must match!')
//       .custom((value, { req }) => value === req.body.password)
//
//     ],(req,res,next) => {
//     const errors = validationResult(req);
//
//     console.log(errors.mapped());
//
//     if (!errors.isEmpty())
//     {
//         // console.log(Object.keys(errors));
//
//         return res.status(422).json({errors:errors.mapped()});
//     }
//
//     //NO VALIDATION ERRORS
//
//
//
// });

// router.post('/login',(req,res,next)=> {
//   passport.authenticate('local', {
//   successRedirect:'/',
//   failureRedirect:'/users/login',
//   failureFlash: true
// })(req, res, next);
// });

// GET /users/teachers
router.get('/teachers',(req,res)=> {
  res.render('teachers');
});

module.exports=router;
