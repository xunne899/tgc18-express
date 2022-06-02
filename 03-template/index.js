// require express
const express = require('express')


// require hbs
const hbs = require('hbs')

// create express
const app = express()


//tell express we are using hbs as template engine
app.set('view engine','hbs') ;


//put in routes

app.get('/', function(req,res){
    res.render('index.hbs')
})

app.get('/hello/:firstname/:lastname', function(req,res){
    let fname = req.params.firstname;
    let lname = req.params.lastname

res.render('hello',{
    'firstName':fname,
    'lastName':lname
})

})

// start the server
// first arg : port number

app.listen(3000, function(){
    console.log("server started")
})