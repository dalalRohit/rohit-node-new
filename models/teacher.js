const mongoose = require('mongoose');
const validator= require('validator');
const _ = require('lodash');
const {ObjectID} = require('mongodb');



//TeacherSchema
var TeacherSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength:10,

    },
		dept:{
			type:String,
			required:true
		},
    code:{
      type:Number,
      required:true
    },
		designation:{
			type:String,
			required:true
		},
		multiple:{
			type:Number,
			required:true
		},
    email:{
        type: String,
        required: true,
        minLength:10,
        unique:true,
        validate:{
          validator: validator.isEmail,
          message:"{VALUE} is not a valid e-mail!"
        }
    },
    div:{
        type: String,
        required: true,
    },
		designation:{
			type:String,
			required:true
		},
    subject:{
      type:"String",
      required:true
    }

});


TeacherSchema.statics.findByDept= function (dept)
{
    return Teacher.find({code:dept});
};

TeacherSchema.statics.findByDept1= function (dept)
{
    var promise= Teacher.find({code:dept}).exec();
    // res.send(promise);
    return promise;
};

// User Schema
var Teacher=mongoose.model('Teacher',TeacherSchema);

module.exports=Teacher;
