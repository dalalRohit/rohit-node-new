var User=require('./../models/user');
var Teacher=require('./../models/teacher');

var authenticate=function (req,res,next)
{
  // console.log(req);
  req.headers={
    'x-auth':"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWJkZDYyZTdjMjA5NDBhNmMxN2M0ZjYiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTIyMzkwNTkyfQ.uPQHOqwSNahX6xvtHwTJXZXKIh0VhI9IlzOLIF0wE6o"
  }

  var token= req.body.token || req.query.token || req.header('x-auth');

  //calling findByToken of user.js (model)
  if(token)
  {
      //write something lol
  }
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
      Teacher.findByDept(req.roll.dept).then( (teachers) => {
        assign(teachers);
        // req.teachers=teachers;
      });

      function assign(teachers)
      {
        req.teachers=teachers;
        //console.log("inside assign function:",req.teachers);
      }

      //console.log(`req.teachers: ${req.teachers}`);





      next();

    }).catch( (e) => {
      res.status(401).send("Authentication required! Token not provided");

    });
}

module.exports={authenticate};
