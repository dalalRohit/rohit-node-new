const {MongoClient}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/nodedb',(err,client) => {
  var db = client.db('nodedb');
  db.collection('teachers').insertMany([
  	{name: "Abhishek Barve", dept: "inft", code:101, designation:"Assistant-Professor", email: "abhishek.barve@vit.edu.in"},
  	{name: "Akshay Loke", dept: "inft", code:101, designation: "Assistant-Professor", email: "akshay.loke@vit.edu.in"},
  	{name: "Ajay Dhruv", dept: "inft", code:101, designation: "Assistant-Professor", email: "ajay.dhruv@vit.edu.in"},
  	{name: "Anuja Gote", dept: "inft", code:101, designation: "Assistant-Professor", email: "anuja.gote@vit.edu.in"},
  	{name: "Bhanu Tekwani", dept: "inft", code:101, designation: "Assistant-Professor", email: "bhanu.tekwani@vit.edu.in"},
  	{name: "Chintan Shah", dept: "inft", code:101, designation: "Assistant-Professor", email: "chintan.shah@vit.edu.in"},
  	{name: "Deepali Nayak", dept: "inft", code:101, designation: "Assistant-Professor", email: "deepali.naik@vit.edu.in"},
  	{name: "Deepali Shrikhande", dept: "inft", code:101, designation: "Assistant-Professor", email: "deepali.shrikhande@vit.edu.in"},
  	{name: "Deepali Vora", dept: "inft", code:101, designation: "Assistant-Professor", email: "deepali.vora@vit.edu.in"},
  	{name: "Dr. Meenakshi S. Arya", dept: "inft", code:101, designation: "HOD", email: "meenakshi.arya@vit.edu.in"},
  	{name: "Girish Wadhwa", dept: "inft", code:101, designation: "Assistant-Professor", email: "girish.wadhwa@vit.edu.in"},
  	{name: "Harshali Rambade", dept: "inft", code:101, designation: "Assistant-Professor", email: "harshali.rambade@vit.edu.in"},
  	{name: "Ichhanshu Jaiswal", dept: "inft", code:101, designation: "Assistant-Professor", email: "ichhanshu.jaiswal@vit.edu.in"},
  	{name: "Indu Anoop", dept: "inft", code:101, designation: "Assistant-Professor", email: "indu.anoop@vit.edu.in"},
  	{name: "Kanchan Dhuri", dept: "inft", code:101, designation: "Assistant-Professor", email: "kanchan.dhuri@vit.edu.in"},
  	{name: "Mohit Gujar", dept: "inft", code:101, designation: "Assistant-Professor", email: "mohit.gujar@vit.edu.in"},
  	{name: "Neha Chankhore", dept: "inft", code:101, designation: "Assistant-Professor", email: "neha.chankhore@vit.edu.in"},
  	{name: "Rajan Singh", dept: "inft", code:101, designation: "Assistant-Professor", email: "rajan.singh@vit.edu.in"},
  	{name: "Sachin Bojewar", dept: "inft", code:101, designation: "Assistant-Professor", email: "sachin.bojewar@vit.edu.in"},
  	{name: "Santosh Tamboli", dept: "inft", code:101, designation: "Assistant-Professor", email: "santosh.tamboli@vit.edu.in"},
  	{name: "Shashikant Mahajan", dept: "inft", code:101, designation: "Assistant-Professor", email: "shashikant.mahajan@vit.edu.in"},
  	{name: "Varsha Bhosale", dept: "inft", code:101, designation: "Assistant-Professor", email: "varsha.bhosale@vit.edu.in"},
  	{name: "Varsha Turkar", dept: "inft", code:101, designation: "Assistant-Professor", email: "varsha.turkar@vit.edu.in"},
  	{name: "Vidya Chitre", dept: "inft", code:101, designation: "Assistant-Professor", email: "vidya.chitre@vit.edu.in"},

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
