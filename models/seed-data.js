const {MongoClient}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/nodedb',(err,client) => {
  var db = client.db('nodedb');
  db.collection('teachers').insertMany([
    {name:'sample-teacher2',dept:'inft',code:101,designation:'Assistant professor',email:"sample-teacher2@vit.edu.in"},
    {name:'sample-teacher1',dept:'inft',code:101,designation:'Assistant professor',email:"sample-teacher1@vit.edu.in"},
    {name:'sample-teacher3',dept:'inft',code:101,designation:'Assistant professor',email:"sample-teacher3@vit.edu.in"},
    {name:'sample-teacher4',dept:'inft',code:101,designation:'Assistant professor',email:"sample-teacher4@vit.edu.in"},
    {name:'sample-teacher5',dept:'inft',code:101,designation:'Assistant professor',email:"sample-teacher5@vit.edu.in"},

    {name:'sample-teacher21',dept:'cmpn',code:100,designation:'Assistant professor',email:"sample-teacher21@vit.edu.in"},
    {name:'sample-teacher11',dept:'cmpn',code:100,designation:'Assistant professor',email:"sample-teacher11@vit.edu.in"},
    {name:'sample-teacher31',dept:'cmpn',code:100,designation:'Assistant professor',email:"sample-teacher31@vit.edu.in"},
    {name:'sample-teacher41',dept:'cmpn',code:100,designation:'Assistant professor',email:"sample-teacher41@vit.edu.in"},
    {name:'sample-teacher51',dept:'cmpn',code:100,designation:'Assistant professor',email:"sample-teacher51@vit.edu.in"},

    {name:'sample-teacher22',dept:'etrx',code:102,designation:'Assistant professor',email:"sample-teacher22@vit.edu.in"},
    {name:'sample-teacher12',dept:'etrx',code:102,designation:'Assistant professor',email:"sample-teacher12@vit.edu.in"},
    {name:'sample-teacher32',dept:'etrx',code:102,designation:'Assistant professor',email:"sample-teacher32@vit.edu.in"},
    {name:'sample-teacher42',dept:'etrx',code:102,designation:'Assistant professor',email:"sample-teacher42@vit.edu.in"},
    {name:'sample-teacher52',dept:'etrx',code:102,designation:'Assistant professor',email:"sample-teacher52@vit.edu.in"},

    {name:'sample-teacher23',dept:'extc',code:124,designation:'Assistant professor',email:"sample-teacher23@vit.edu.in"},
    {name:'sample-teacher13',dept:'extc',code:124,designation:'Assistant professor',email:"sample-teacher13@vit.edu.in"},
    {name:'sample-teacher33',dept:'extc',code:124,designation:'Assistant professor',email:"sample-teacher33@vit.edu.in"},
    {name:'sample-teacher43',dept:'extc',code:124,designation:'Assistant professor',email:"sample-teacher43@vit.edu.in"},
    {name:'sample-teacher53',dept:'extc',code:124,designation:'Assistant professor',email:"sample-teacher53@vit.edu.in"},


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
