var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('express-flash');
var handlebars = require('express-handlebars')

var app = express();
var sessionStore = new session.MemoryStore;

// View Engines
//app.set('view engine', 'jade');
app.engine('handlebars', handlebars()); app.set('view engine', 'handlebars');
//app.set('view engine', 'ejs');

app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));
app.use(flash());

// Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
app.use(function(req, res, next){
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.sessionFlash = req.session.sessionFlash;
    delete req.session.sessionFlash;
    next();
});

// Route that creates a flash message using the express-flash module
app.all('/express-flash', function( req, res ) {
    req.flash('success', 'This is a flash message using the express-flash module.');
    res.redirect(301, '/');
});

// Route that creates a flash message using custom middleware
app.all('/session-flash', function( req, res ) {
    req.session.sessionFlash = {
        type: 'success',
        message: 'This is a flash message using custom middleware and express-session.'
    }
    res.redirect(301, '/');
});

// Route that incorporates flash messages from either req.flash(type) or res.locals.flash
app.get('/', function( req, res ) {
    res.render('index', { expressFlash: req.flash('success'), sessionFlash: res.locals.sessionFlash });
});

var server = app.listen(3000, function () {
    console.log('Flash app listening at http://localhost:3000');
});

module.exports = app;