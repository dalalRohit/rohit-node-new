const passport=require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const passport-local=require('passport-local');
const bcrypt=require('bcryptjs');


const User=require('../models/user');

module.exports = function(passport){
  // Local Strategy
  passport.use(new LocalStrategy(function(loginid, password, done){
    // Match loginid
    let query = {loginid:loginid};    //prepare query ; name=loginID

    User.findOne(query, function(err, user){
      if(err)
        throw err;

      if(!user)
      {
        return done(null, false);
      }

      // Match Password
      bcrypt.compare(password, user.password, function(err, isMatch){
        if(err)
          throw err;

        if(isMatch)
        {
          return done(null, user);
        }
        else
        {
          return done(null, false);
        }

      });
    });
  }));


  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}
