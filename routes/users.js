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
const flash    = require('connect-flash');
const nodemailer=require('nodemailer');
const session=require('express-session');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

// const localstorage=require('localstorage');

//############################BODY-PARSER(MDN_DOCS)############################
const { check, } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');


// ############################AUTHENTICATION MIDDLEWARE###############################
var {authenticate}=require('./../middleware/authenticate');

//Models
//############################app setup############################
var app=express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public',express.static(__dirname+'/public'));

//Express session MIDDLEWARE
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// https://github.com/expressjs/express-messages/issues/13
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
//############################Models############################
let User=require('../models/user');
let Teacher=require('../models/teacher');

//############################body-parser middleware############################
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//############################PAssport middleware############################
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

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
            req.flash('success','You are now registered!');

            // res.render('login',{
            //   pageTitle:"Login page",
            //   msg:req.flash('success')
            // });

            res.redirect('/users/login');
          })
          .catch( (err) => {
            req.flash('danger','Something went wrong!');
            res.render('register',{
              msg:req.flash('danger'),
              pageTitle:"Register page"
            })
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
        req.details={fac,sub,des};

        //console.log('Token here',token);
        res.header('x-auth',token);
        req.flash('success','You are now logged in!');
        res.status(200).render('dashboard',{
          pageTitle:"Dashboard",
          msg:"You're now logged in!",
          user,
          roll,
          teachers:fac,
          subjects:sub,
          designation:des,
          token
        });

        // res.redirect('/users/');
      }).catch( (err) => {
        res.status(400).send();
      });




    });
    req.user=user;
    console.log(req.user);
  })
  .catch( (err) => {
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

// ############################ PASSTOKEN MIDDLEWARE ############################
var passToken=function (req,res,next)
{
  // console.log(`Loginid of req.user: ${req.user.loginid}`);
  req.headers={
    'x-auth':User.giveToken('16101b0035')
  };

  next();
}


//############################PRIVATE ROUTES #################################
//GET /
app.get('/',passToken,authenticate,(req,res) => {
  console.log(`req.details: ${req.details}`);
  res.render('dashboard',{
    pageTitle:"Dashboard",
    user:req.user,
    roll:req.roll,
    teachers:req.details,
  }
  );
});

//GET /users/give-feedback
app.get('/give-feedback',passToken,authenticate,(req,res) => {
  res.render('feed',{
    success:true,
    user:req.user,
    roll:req.roll,
    pageTitle:"Submit feedback page"

  });
});

//GET /users/Submit
app.get('/submit',authenticate,(req,res) => {
  res.render('submit',{
    pageTitle:"Succesfull",
    user:req.user,
    roll:req.roll
  });

});

//GET /users/verify
app.get('/verify',authenticate,(req,res) => {
  res.render('verify',{
    pageTitle:"Verify page",
    user:req.user,
    success:true
  });
});


//POST /users/verify
app.post('/verify',authenticate,(req,res) => {
  res.render('submit',{
    pageTitle:"Succesful",
    user:req.user,
    success:true
  })
});

//POST /users/submit
app.post('/submit',passToken,authenticate,[
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
  const tq=req.body.tqselect;
  const pun=req.body.punselect;

  console.log(`Responses are : ${name}  ${dept} ${tq} ${pun}` );


//##############################################################################
  const output=`<div class="container-fluid">
    <p>You have a new feedback!</p>

    <h3>Feedback details</h3>

    <ul>
      <li>Teaching quality : ${tq}</li>
      <li>Punctuality : ${pun}</li>
    </ul>
  </div>`;

//#############################################MAILING SCRIPT#####################################
nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    if (err)
    {
        res.status(500).send(err);
    }
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
        if (error)
        {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
});

  res.render('feed',{
    msg:"Feedback is succesfully sent!",
    pageTitle:"Submitted succesfully",
    user:req.user
  });
});


// GET /users/teachers
app.get('/teachers',passToken,authenticate,(req,res) => {
  res.render('teachers',{
  pageTitle:"Teachers page",
  user:req.user,
  teachers:req.teachers});
});

//GET /users/logout
app.get('/logout',passToken,authenticate,(req,res)=> {

  //udemy logout logic
  req.user.removeToken(req.token).then( () => {
    res.status(200).send();
  }).catch( () => {
    res.status(400).send();
  });

  res.redirect('/users/login');
});

//GET /users/feedback
app.get('/feedback',passToken,authenticate,(req,res) => {


  res.render('feedback',{
    pageTitle:"Feedback page",
    user:req.user,
    teachers:req.teachers

  });
});



//EXTRA UDEMY ROUTE
// DELETE /users/me/token
app.delete('/me/token',passToken,authenticate,(req,res)=> {

  req.user.removeToken(req.token).then( () => {
    res.status(200).send();
  }).catch( () => {
    res.status(400).send();
  });

});

//private routes
app.get('/me',passToken,authenticate,(req,res)=> {
  res.json(req.user.tokens);

});

module.exports=app;
