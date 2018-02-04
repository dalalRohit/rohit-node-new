const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

// const MongoClient=require('mongodb').MongoClient;
//known as ES6 object destructring
const {MongoClient}=require('mongodb');  //same as the 1st line. ES6 syntax


//for inserting multiple teacher records in 'teachers' collection
MongoClient.connect('mongodb://localhost:27017/nodedb',(err,db) => {
	if(err)
	{
		return console.log('Unable to connect to MongoDB(teachers) !');
	}
	console.log('Connected to the DB (teachers)!'); //success

  db.collection('teachers').insert([
    {name:"teacher-2",dept:"inft",div:"a,b",designation:"Assistant professor",email:"teacher2@vit.edu.in",multiple:1},
    {name:"teacher-3",dept:"inft",div:"a,b",designation:"Assistant professor",email:"teacher3@vit.edu.in",multiple:1},
    {name:"teacher-4",dept:"inft",div:"a,b",designation:"Assistant professor",email:"teacher4@vit.edu.in",multiple:1},
    {name:"teacher-5",dept:"inft",div:"a,b",designation:"Assistant professor",email:"teacher5@vit.edu.in",multiple:1}
  ] , (err,res) => {
    if(err)
    {
      console.log('Unable to insert multiple records!');
    }

    console.log(JSON.stringify(res.ops,undefined,2));
  });
});

// var TeacherSchema=new mongoose.Schema({});


//from user schema
// //instance methods
//    UserSchema.methods.generateAuthToken= function () {
//      var user=this;
//      var access='auth';
//
//      var token=jwt.sign({_id:user._id.toHexString(),access},'rohit_dalal').toString();
//      //don't use user.tokens.push(). It's of older version
//      //from UDEMY Q&A.
//      user.tokens=user.tokens.concat({access,token});
//
//      return user.save().then( () => {
//        return token;
//      });
// };
//
// //for login process
//  UserSchema.statics.findByCred= function (loginid,password) {
//    var User=this;
//    return User.findOne({loginid}).then( (user) => {
//      //console.log(`LoginID: ${loginid} Password:${password}`);
//
//      return new Promise( (resolve,reject) => {
//        bcrypt.compare(password,user.password, (err,res) => {
//          if(res)
//          {
//             resolve(user);
//          }
//          else
//          {
//             reject();
//          }
//        });
//      });
//    });
// }
//
// //model methods for jwt
// UserSchema.statics.findByToken=function(token) {
//   var User=this;
//
//   var decoded;
//
//   try
//   {
//     decoded=jwt.verify(token,'rohit_dalal');
//   }
//   catch (e)
//   {
//     return Promise.reject();
//   }
//
//   //nested query
//   return User.findOne({
//     '_id':decoded._id,
//     'tokens.token':token,
//     'tokens.access':'auth'
//   });
//
// }

// Teacher Schema
// var Teacher=mongoose.model('Teacher',TeacherSchema);

// module.exports=Teacher;
