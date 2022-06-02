// going to include express
//look for express folder in node_modules
// locate the index.js in express and return an object 
const express = require('express');

//create express application
let app = express()


// add routes
//route is url
// 1st argument: path of url
// 2nd function happens when client access path
app.get('/', function(req,res){

    res.send("<h1>Hello World</h1>")
})


app.get('/about-us',function(req,res){
    res.send("About Us")
})

app.get('/hello/:firstname',function(req,res){
    res.send("Hi," + req.params.firstname)
})


app.get('/calculate',function(req,res){

    let a = req.query.a;
    let b = req.query.b
    res.send(a+b)
})


// start the server
// first arg : port number

app.listen(3000, function(){
    console.log("server started")
})