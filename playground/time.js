const moment=require('moment');

var time=moment().format('dddd, MMMM Do YYYY, h:mm:ss a');

console.log(typeof time,`${time}`);
