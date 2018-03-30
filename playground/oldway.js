//POST users/register
app.post('/register',[
    check('loginid','LoginID must be atleast 10 chars long').isLength({min:10}),
    check('loginid','LoginID cannot be empty').exists(),
    check('email').isEmail(),
    check('email','EmailID is must!').exists(),
    check('password','Password must be atleast 6 chars long').isLength({min:6}),
    check('password2','Two passwords must match!')
      .custom((value, { req }) => value === req.body.password)

    ],(req,res,next) => {
    const errors = validationResult(req);

    //console.log(errors.mapped());
    if (!errors.isEmpty())
    {   //res.send(errors);
        // console.log(Object.keys(errors));
        res.status(422).json({errors:errors.mapped()});
    }
    const loginid=req.body.loginid;
    const email=req.body.email;
    const password=req.body.password;
    const password2=req.body.password2;

    var body=_.pick(req.body,['loginid','email','password']);

    //NO VALIDATION ERRORS
    var user=new User(body);

    //password hashing
    bcrypt.genSalt(10,(err,salt) => {
      bcrypt.hash(user.password,salt,(err,hash) => {

        if(err)
        {
          return console.log(err);
        }
        //changing plain text password of user doc to newly hashed password
        user.password=hash;

        //saving user with hashed password
        user.save()
          .then( (user) => {
            return user.generateAuthToken();
          })
          .then( (token) => {
            res.header('x-auth',token);
            // res.render('login',{
            //   pageTitle:"Login page",
            //   msg:"You're now registered!"});

            res.redirect('/users/login');
          })
          .catch( (err) => {
            res.status(400).send("Something went wrong!!");
          });
      })
    });
});


//POST /users/login
app.post('/login',(req,res)=> {
  var id=req.body.loginid;
  var password=req.body.password;

  //assigning found user to 'user' to pass it along with the route
  var user= User.findByCred(id,password).then( (user) => {

    return user.generateAuthToken().then( (token) => {
      res.header('x-auth',token);
      // LOCALSTORAGE API
      // if(localstorage)
      // {
      //   localstorage.setItem('token',token);
      //
      // }
      // else {
      //   console.log("Local-storage is not defined!");
      // }
      //splitting of roll no in dept,div,year,no
      var roll=user.splitRoll(user.loginid);
      var dept=roll.dept;

      //res.status(200).send();
      // //finding teachers according to dept code and rendering it on dashboard
      Teacher.findByDept(dept).then( (teachers) => {
        //console.log(teachers);
        var fac=[];
        var des=[];
        var sub=[];

        for(var i=0;i<teachers.length;i++)
        {
          des.push(teachers[i].designation)
          fac.push(teachers[i].name);
          sub.push(teachers[i].subject);
        }
        var details={fac,sub,des};

        //console.log('Token here',token);

        // res.status(200).render('dashboard',{
        //   pageTitle:"Dashboard",
        //   msg:"You're now logged in!",
        //   user,
        //   roll,
        //   teachers:fac,
        //   subjects:sub,
        //   designation:des,
        //   token
        // });
        res.header('x-auth',token);
        res.redirect('/users/');
      }).catch( (err) => {
        res.status(400).send();
      });




    });
    req.user=user;
    console.log(req.user);
  })
  .catch( (err) => {
    res.status(400).render('login',{
      pageTitle:"Login page",
      error:"No user found! Check credentials once!"
    });
  });


});
