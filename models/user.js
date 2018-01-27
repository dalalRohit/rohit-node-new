const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const _ = require('lodash');
const {ObjectID} = require('mongodb');


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
      }
    }]
});
// User Schema
var User=mongoose.model('User',UserSchema);

//instance methods
   UserSchema.methods.generateAuthToken= function () {
     var user=this;
     console.log(user);
     var access='auth';

     var token=jwt.sign({_id:user._id.toHexString(),access},'rohit_dalal').toString();
     user.tokens.push({access,token});

     return user.save().then( () => {
       return token;
       console.log(token);

     });
};

//for login process
 UserSchema.statics.findByCred= function (loginid,password) {
   var User=this;
   return User.findOne({loginid}).then( (user) => {
     console.log(`LoginID: ${loginid} Password:${password}`);

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
//    UserSchema.methods.toJSON = function () {
//      var user = this;
//      var userObject = user.toObject();
//
//      return _.pick(userObject, ['_id', 'email']);
//    };


module.exports=User;
