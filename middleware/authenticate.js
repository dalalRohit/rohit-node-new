var User=require('./../models/user');
var Teacher=require('./../models/teacher');

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
    req.roll=user.splitRoll(user.loginid);
    req.loggedin=true;
    //req.teachers=Teacher.findByDept(roll.dept);



    next();

  }).catch( (e) => {
    res.status(401).send("Authentication required!");

  });
}

module.exports={authenticate};
