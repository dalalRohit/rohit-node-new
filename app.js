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
    secret: 'rohit_dalal',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: 600000
    }
}));

// Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
app.use(function(req, res, next){
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});

// Route that incorporates flash messages from either req.flash(type) or res.locals.flash
app.get('/', function( req, res ) {
    res.render('index', { expressFlash: req.flash('success'), sessionFlash: res.locals.sessionFlash });
});

app.listen(3000,() => {
	console.log('Connected on port 3000!');
});

module.exports=app;
