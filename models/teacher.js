const mongoose = require('mongoose');
const validator=require('validator');
const _ = require('lodash');
const {ObjectID} = require('mongodb');



//TeacherSchema
var TeacherSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength:10,
        unique:true
    },
		dept:{
			type:String,
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
		}

});


TeacherSchema.statics.findByYearAndDiv= function ()
{
	var Teacher=this;

	return Teacher.find({dept:'inft'}).toArray().then( (teachers) => {
		console.log(teachers);
	} , (err) => {
		console.log(err);
	});
};
