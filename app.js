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
const ehbs=require('express-handlebars');
const hbs=require('hbs');
const _ =require('lodash');
const { check, } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var {mongoose}=require('./db/db');
var {authenticate}=require('./middleware/authenticate');

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
hbs.registerPartials(__dirname+'/views/partials');
// app.engine('hbs',hbs({extname:'hbs',layoutsDir: __dirname+'/views/layouts/'}));
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

// logout
app.get('/logout', function(req, res){
  req.logout();
  //req.flash('success', 'You are logged out');
  res.redirect('/users/login');
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
        //res.status(422).json({errors:errors.mapped()});
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
//POST /users/login
app.post('/users/login',(req,res)=> {
  var id=req.body.loginid;
  var password=req.body.password;
  //assigning fond user to 'user' to pass it along with the route
  var user= User.findByCred(id,password).then( (user) => {
    //res.status(200).send('LoggedIn....');
    //console.log("user loggedIN");
    res.render('teachers',{success:true,user:user});
  }).catch( (err) => {
    res.status(400).send("No user found! Check credentials once! ");
  });

});



//private routes
app.get('/users/me',authenticate,(req,res)=> {
  res.send(req.user);
});


app.listen(3000,() => {
	console.log('Connected on port 3000!');
});

module.exports=app;
