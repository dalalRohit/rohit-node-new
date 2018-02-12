const axios=require('axios');
const express=require('express');

var app=express();

app.get('/',(req,res) => {
  
});

app.listen(5000,() => {
  console.log('Server UP on port 5000!');
});
