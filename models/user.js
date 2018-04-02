const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const _ = require('lodash');
const {ObjectID} = require('mongodb');
const moment=require('moment');

//UserSchema
var UserSchema=new mongoose.Schema({
    loginid:{
        type: String,
        required: true,
        minlength:10,
        unique:true
    },
    email:{
        type: String,
        required: true,
        trim:true,
        minLength:10,
        unique:true,
        validate:{
          validator: validator.isEmail,
          message:"{VALUE} is not a valid e-mail!"
        }
    },
    password:{
        type: String,
        required: true,
        minlength:6
    },
    tokens: [{
      access:{
        type:String,
        required:true
      },
      token:{
        type:String,
        required:true
       },
      // created:{
      //   type:String,
      //   required:true
      // }

  }]

});


//instance methods
   UserSchema.methods.generateAuthToken= function () {
     var user=this;
     var access='auth';

     var token=jwt.sign({_id:user._id.toHexString(),access},'rohit_dalal').toString();

     var time=moment().format('dddd, MMMM Do YYYY, h:mm:ss a');

     //don't use user.tokens.push(). It's of older version
     //from UDEMY Q&A.
     user.tokens=user.tokens.concat({access,token});

     //user.tokens.created=moment().format('dddd, MMMM Do YYYY, h:mm:ss a');


     return user.save().then( () => {
       return token;
     });
};

//for login process
 UserSchema.statics.findByCred= function (loginid,password) {
   var User=this;

   return User.findOne({loginid}).then( (user) => {
     //console.log(`LoginID: ${loginid} Password:${password}`);
     if(!user)
     {
       return Promise.reject();
     }

     return new Promise( (resolve,reject) => {
       bcrypt.compare(password,user.password, (err,res) => {
         if(res)
         {
            resolve(user);
         }
         else
         {
            reject();
         }
       });
     });
   });
}

UserSchema.statics.giveToken=function (loginid)
{
  var User=this;
   return User.findOne({loginid}).then( (user) => {
     //console.log(`User found!: ${user}`);
    if(!user)
    {
      return Promise.reject();
    }

    // return new Promise( (resolve,reject) => {
    //
    // })
    console.log(`User LoginID: ${user.loginid}`);
    console.log('Token here:',user.tokens[1].token)
     var token= user.tokens[1].token;
      return token;


  });

  // console.log(`User LoginID: OUTSIDE ${user.loginid}`);
  // console.log('Token here: OUTSIDE',user.tokens[1].token)
}


//for DELETE /users/token/me
UserSchema.methods.removeToken= function (token) {
  var user=this;

  return user.update({
    $pull:{
      tokens:{token}
    }
  });
};

//model methods for jwt
UserSchema.statics.findByToken=function(token) {
  var User=this;

  var decoded;

  try
  {
    decoded=jwt.verify(token,'rohit_dalal');
  }
  catch (e)
  {
    return Promise.reject();
  }

  //nested query
  return User.findOne({
    '_id':decoded._id,
    'tokens.token':token,
    'tokens.access':'auth'
  });

}


//instance method for splitting roll no
UserSchema.methods.splitRoll = function (roll)
{
  //16101b0035
  var year=roll.slice(0,2);
  var dept=roll.slice(2,5);
  var div=roll[5];
  var no=roll.slice(6,11);

//  var years={'FE','SE','TE','BE'};
  var depts={};
  var divs={}

  var rollNo={year:year,dept:dept,div:div,no:no};

  return rollNo;

};
// User Schema
var User=mongoose.model('User',UserSchema);

module.exports=User;
