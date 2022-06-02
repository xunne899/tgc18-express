// require express
const express = require('express')


// require hbs
const hbs = require('hbs')

// create express
const app = express()


//tell express we are using hbs as template engine
app.set('view engine','hbs') ;

//static files in public folder
app.use(express.static('public'))


//put in routes

app.get('/', function(req,res){
    res.render('index.hbs')
})

app.get('/hello/:firstname/:lastname', function(req,res){
    let fname = req.params.firstname;
    let lname = req.params.lastname
// render is use to render inside hbs file (html)
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