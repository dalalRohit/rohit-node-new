var mongoose=require('mongoose');

mongoose.Promise=global.Promise; //setting Promise
mongoose.connect(process.env.MONGODB_URI||'mongodb://localhost:27017/nodedb');


module.exports={mongoose:mongoose};
