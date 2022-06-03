const express = require('express')
const hbs = require('hbs')
const waxon =require('wax-on')

const app = express()
app.set('view engine','hbs')
app.use(express.static('public'))


waxon.on(hbs.handlebars)
waxon.setLayoutPath('views/layouts')


app.use(express.urlencoded({
    'extended' : false
}))

//routes
app.get('/', function(req,res){
    res.send("Hello World");
})


// one route to display the form
app.get('/bmi', function(req,res){
    res.render('bmi');
})

// one route to process the form
app.post('/bmi', function(req,res){
    let weight = Number(req.body.Weight);
    let height = Number(req.body.Height);
    let bmi = weight / height ** 2;
    res.render('bmi-results',{
        'bmi': bmi
    })

})

/* 3. START SERVER */
app.listen(3000, function(){
    console.log("server has been started");
})