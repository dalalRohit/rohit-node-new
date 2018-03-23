const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const hbs=require('hbs');
const _ =require('lodash');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const axios=require('axios');
const request=require('request');
const passport = require('passport');
const flash    = require('connect-flash');
const nodemailer=require('nodemailer');


const { check, } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


var {authenticate}=require('./../middleware/authenticate');


//app setup
var app=express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public',express.static(__dirname+'/public'));


//Models
let User=require('../models/user');
let Teacher=require('../models/teacher');

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//############################## PAGE GETTERS ##################################
//GET /users/login
app.get('/login',(req,res)=>{
    res.render('login',{
        pageTitle:"Login page"
    });
});

//GET /users/register
app.get('/register',(req,res)=>{
    res.render('register',{
        pageTitle:"Register page"
    });
});

//######################### PROCEDURAL ROUTES #####################
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
            return user.generateAuthToken();
          })
          .then( (token) => {
            res.header('x-auth',token);
            res.render('login',{
              pageTitle:"Login page",
              success:true,
              msg:"You're now registered!"});
          })
          .catch( (err) => {
            res.status(400).send("Something went wrong!!");
          });
      })
    });
});


//POST /users/login
app.post('/login',(req,res)=> {
  var id=req.body.loginid;
  var password=req.body.password;

  //assigning found user to 'user' to pass it along with the route
  var user= User.findByCred(id,password).then( (user) => {

    return user.generateAuthToken().then( (token) => {
      res.header('x-auth',token);


      //splitting of roll no in dept,div,year,no
      var roll=user.splitRoll(user.loginid);
      var dept=roll.dept;

      //res.status(200).send();
      // //finding teachers according to dept code and rendering it on dashboard
      Teacher.findByDept(dept).then( (teachers) => {
        //console.log(teachers);
        var fac=[];
        var des=[];
        var sub=[];

        for(var i=0;i<teachers.length;i++)
        {
          des.push(teachers[i].designation)
          fac.push(teachers[i].name);
          sub.push(teachers[i].subject);
        }
        var details={fac,sub,des};

        console.log('Token here',token);

        res.status(200).render('dashboard',{
          success:true,
          pageTitle:"Dashboard",
          msg:"You're now logged in!",
          user,
          roll,
          teachers:fac,
          subjects:sub,
          designation:des,
          token
        });

      }).catch( (err) => {
        res.status(400).send();
      });




    });
  }).catch( (err) => {
    res.status(400).render('login',{
      pageTitle:"Login page",
      error:"No user found! Check credentials once!"
    });
  });


});

// DELETE /users/logout
app.delete('/logout',authenticate, function(req, res){
//udemy logout logic
req.user.removeToken(req.token).then( () => {
  res.status(200).send();
}).catch( () => {
  res.status(400).send();
});

});

// var passToken=function (req,res,next)
// {
//   req.headers={
//     'x-auth':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWE3YTViZDVjM2ZiMDI4Y2MzNmQ5ODciLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTIwOTM2Mzk5fQ.I4cQ8QFvgR9FTE3e_2zpgfNFD-Qv0zKuCkAxxjsWtJU'
//   };
//
//   next();
// }
//############################PRIVATE ROUTES #################################
//GET /
app.get('/',authenticate,(req,res) => {
  console.log(req.body.token);
  res.render('dashboard',{success:true,
  pageTitle:"Dashboard",
  user:req.user,
  roll:req.roll,
  teachers:req.teachers,
  }
  );
});

//GET /users/give-feedback
app.get('/give-feedback',(req,res) => {
  res.render('feed',{
    success:true,
    user:req.user,
    roll:req.roll,
    pageTitle:"Submit feedback page",
    teacher:"Sampleteacher1",

  });
});

//GET /users/Submit
app.get('/submit',authenticate,(req,res) => {

  res.render('submit',{
    pageTitle:"Succesfull",
    success:true,
    user:req.user,
    roll:req.roll
  });

});

//POST /users/submit
app.post('/submit',[
  check('name',"NAME-Input here is must!").isLength({min:1}),
  // check('subject',"SUBJECT-Input here is must!").isLength({min:1}),
  check('dept',"DEPARTMENT-Input here is must!").isLength({min:1}),

],(req,res,next) => {

  const errors = validationResult(req);

  //console.log(errors.mapped());
  if (!errors.isEmpty())
  {   //res.send(errors);
      // console.log(Object.keys(errors));
      // res.status(422).json({errors:errors.mapped()});
      res.status(400).send(errors.mapped());
  }


  const name=req.body.name;

  const dept=req.body.dept;

  console.log(`Responses are : ${name}  ${dept}`);

  const output=`
  <p>You have a new feedback!</p>

  <h3>Feedback details</h3>

  <ul>
    <li>Teaching quality : ${req.body.tq}</li>
    <li>Punctuality : ${req.body.pun}</li>
  </ul> `;
  // Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service:'gmail',
        // host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'dalalrohit102@gmail.com', // generated ethereal user
            pass: 'chelsearohit1234' // generated ethereal password
        },
        tls:{
          rejectUnauthorized:false
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: 'dalalrohit102@gmail.com', // sender address
        to: 'dalalrohit102@gmail.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
});

  res.redirect('/users/submit');


});


// GET /users/teachers
app.get('/teachers',authenticate,(req,res) => {
  res.render('teachers',{success:true,
  pageTitle:"Teachers page",
  user:req.user,
  teachers:req.teachers});
});

//GET /users/logout
app.get('/logout',authenticate,(req,res)=> {

  //udemy logout logic
  req.user.removeToken(req.token).then( () => {
    res.status(200).send();
  }).catch( () => {
    res.status(400).send();
  });

  res.redirect('/users/login');
});

//GET /users/feedback
app.get('/feedback',authenticate,(req,res) => {


  res.render('feedback',{
    pageTitle:"Feedback page",
    success:true,
    user:req.user,
    teachers:req.teachers

  });
});



//EXTRA UDEMY ROUTE
// DELETE /users/me/token
app.delete('/me/token',authenticate,(req,res)=> {

  req.user.removeToken(req.token).then( () => {
    res.status(200).send();
  }).catch( () => {
    res.status(400).send();
  });

});

//private routes
app.get('/me',authenticate,(req,res)=> {
  res.send(req.user.tokens[1].token);
  req.headers={
    'x-auth':req.user.tokens[1].token
  };
});

module.exports=app;
