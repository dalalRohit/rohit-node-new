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


// GET /users/teachers
router.get('/teachers',(req,res)=> {
  res.render('teachers',{user:user});
});

module.exports=router;
