var User=require('./../models/user');

var authenticate=function (req,res,next)
{
  var token=req.header('x-auth');

  //calling findByToken of user.js (model)
  User.findByToken(token)
  .then( (user) => {

    if(!user)
    {
      return Promise.reject();

    }

    //modifying req object
    req.user=user;
    req.token=token;
    next();
    
  }).catch( (e) => {
    res.status(401).send("Authentication required!");

  });
}

module.exports={authenticate};
