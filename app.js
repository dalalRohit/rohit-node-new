const express = require('express');
const path = require('path');
// const mongoose = require('mongoose');
const {ObjectID} = require('mongodb');

const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const bcrypt=require('bcryptjs');
const passport = require('passport');
const hbs=require('express-handlebars');
const _ =require('lodash');
const { check, } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var {mongoose}=require('./db/db');

// const config = require('./config/database');
var app=express();


//##########################DATABASE############################
// mongoose.connect(config.database);
// let db = mongoose.connection;

// Bring in Models
var User = require('./models/user');

// Route files for /users
var users=require('./routes/users');
app.use('/users',users);


app.set('views', path.join(__dirname, 'views'));
app.use('/public',express.static(__dirname+'/public'));

// view engine
//app.engine('hbs',hbs({extname:'hbs',defaultLayout:'layout',lauoutsDir: __dirname+'/views/layouts/'}));
app.set('view engine', 'hbs');


//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//GET /
app.get('/', (req,res) => {
    res.render('index');
});

//passport config
require('./config/passport')(passport);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

//GET /login
app.get('/login',(req,res)=>{
    res.render('login',{
        pageTitle:"Login page"
    });
});

//GET /register
app.get('/register',(req,res)=>{
    res.render('register',{
        pageTitle:"Register page"
    });
});
// //POST users/register
app.post('/users/register',[
    // var loginid=req.body.loginid;
    // var email=req.body.email;
    // var password=req.body.password;
    // var password2=req.body.password2;
    //
    // console.log(`${loginid} ${email} ${password}`);

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

    bcrypt.genSalt(10,(err,salt) => {
      bcrypt.hash(user.password,salt,(err,hash) => {

        if(err)
        {
          return console.log(err);
        }

        user.password=hash;

        user.save()
        .then( (user) => {
          //res.send('YOU NOW CAN LOGIN');
          res.send(user);
          //return user.generateAuthToken();
        })
        .then( (token) => {
          res.header('x-auth',token).send(user);
        })
        .catch( (err) => {
          res.status(400).send(err);
        });
      })
    });


});
//POST /users/login
app.post('/users/login',(req,res)=> {
  var id=req.body.loginid;
  var password=req.body.password;

   User.findByCred(id,password).then( (user) => {
    res.status(200).send('LoggedIn....');
    res.redirect('/users/teachers');
    res.render('teachers');
  }).catch( (err) => {
    res.status(400).send("No user found! Check credentials once! ");
  });

});



app.listen(3000,() => {
	console.log('Connected on port 3000!');
});

module.exports=app;
