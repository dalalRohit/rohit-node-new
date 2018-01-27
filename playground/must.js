function loaduser()
{

var template=$('#template').html();
Mustache.parse(template);
var rendered=Mustache.render(template,{name:'ROHIT'});

$('#error').html(rendered);
    
}