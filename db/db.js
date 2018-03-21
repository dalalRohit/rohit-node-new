var mongoose=require('mongoose');

mongoose.Promise=global.Promise; //setting Promise
mongoose.connect("mongodb://localhost:27017/nodedb");


module.exports={mongoose:mongoose};
