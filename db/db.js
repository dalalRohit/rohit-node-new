var mongoose=require('mongoose');

mongoose.Promise=global.Promise; //setting Promise
mongoose.connect('mongodb://admin:chelsearohit1234@ds117469.mlab.com:17469/application');


module.exports={mongoose:mongoose};
