// const express = require('express')
// const hbs = require('hbs')
// const waxOn = require('wax-on')


// require in dependencies
const express = require('express'); 
const hbs = require('hbs');
const waxOn = require('wax-on');

/* 1. SETUP EXPRESS */
const app = express();
app.set('view engine', 'hbs');
app.use(express.static('public')); // whenever express recieves a request for a static file
                                   // it will look for it in the public folder
waxOn.on(hbs.handlebars);
waxOn.setLayoutPath('views/layouts');

// !IMPORTANT!
// setup express to process forms
app.use(express.urlencoded({
    'extended': false // use extended: true if you are processing object in objects in a form
}))




/* 2. ROUTES */
app.get('/', function(req,res){
    res.send("Hello World");
})

// the route below to display a form
app.get('/add-food', function(req,res){
    res.render('add')
})

app.post('/add-food', function(req,res){
    // the content of the form is in req.body
    console.log(req.body);
    let fruit = req.body.fruitName;
    let calories = req.body.calories;
    res.send('form recieved');
})

/* 3. START SERVER */
app.listen(3000, function(){
    console.log("server has been started");
})