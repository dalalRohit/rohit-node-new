const {MongoClient}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/nodedb',(err,client) => {
  var db = client.db('nodedb');
  db.collection('teachers').insertMany([
    {name:'debarthi.goshal',dept:'inft',code:101,designation:'Assistant professor',email:"debarthi.goshal@vit.edu.in",subject:"OS"},
    {name:'ajitkumar.khachane',dept:'inft',code:101,designation:'Assistant professor',email:"ajitkumar.khachane@vit.edu.in",subject:"COA"},
    {name:'rohit.barve',dept:'inft',code:101,designation:'Assistant professor',email:"rohit.barve@vit.edu.in",subject:"AT"},
    {name:'neha.kudu',dept:'inft',code:101,designation:'Assistant professor',email:"neha.kudu@vit.edu.in",subject:"CN"},
    {name:'samphat.mali',dept:'inft',code:101,designation:'Assistant professor',email:"samphat.mali@vit.edu.in",subject:"M4"},
    {name:"anuja.gote",dept:"inft",code:101,designation:'Assistant professor',email:"anuja.gote@vit.edu.in",subject:"Python"},
    {}
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
