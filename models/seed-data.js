const {MongoClient}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/nodedb',(err,db) => {

  db.collection('teachers').insertMany([
    {name:'smaple-teacher1',dept:'etrx',code:144,div:'a',designation:'Assistant professor',email:"sample-teacher1@vit.edu.in",multiple:0},
    {name:'smaple-teache2r',dept:'etrx',code:144,div:'a',designation:'Assistant professor',email:"sample-teacher2@vit.edu.in",multiple:0},
    {name:'smaple-teach3er',dept:'etrx',code:144,div:'a',designation:'Assistant professor',email:"sample-teacher3@vit.edu.in",multiple:0},
    {name:'smaple-teac4her',dept:'etrx',code:144,div:'a',designation:'Assistant professor',email:"sample-teacher4@vit.edu.in",multiple:0},
    {name:'smaple-tea5cher',dept:'etrx',code:144,div:'a',designation:'Assistant professor',email:"sample-teacher5@vit.edu.in",multiple:0},


  ] , (err,res) => {
    if(err)
    {
      console.log("Unable to insert multiple records!");
    }

    console.log("Records inserted succesfully!");
  });
});


// var teachers=[
//   {
//     name:"",dept:,designation:"",email:"",dept_code:
//   },
//   {
//     name:"",dept:,designation:"",email:"",dept_code:
//   },
//   {
//     name:"",dept:,designation:"",email:"",dept_code:
//   },
//   {
//     name:"",dept:,designation:"",email:"",dept_code:
//   }
// ]
