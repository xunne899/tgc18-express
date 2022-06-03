
// const var reassigned 
const express = require('express')

// create express
const app = express()

//setup hbs
app.set('view engine','hbs')

//setup express to define where to find static file
app.use(express.static('public'))
//route
app.get('/', function(req,res){
    res.render('index')
})

app.get('/hello/:name',function(req,res){
    let name = req.params.name
    res.render('hello',{
        'name':name
    })
})
app.listen(3000,function(){
    console.log("Server started")
})