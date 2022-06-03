
const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on'); // wax-on provides template inheritance for hbs

const app = express();
app.set('view engine', 'hbs');  // set the view engine to hbs
app.use(express.static('public')) // the public folder will hold our static files

// setup wax-on
wax.on(hbs.handlebars);
// tell wax-on where to find the base layouts (layouts=template)
wax.setLayoutPath('./views/layouts');

// begin routes here
app.get('/', function(req,res){
    res.render('index')
})

app.get('/form', function(req,res){
    res.render('form')
})

app.get('/amend', function(req,res){
    res.render('amend');
})

app.listen(3000, function(){
    console.log('server started')
})

