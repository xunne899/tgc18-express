const express = require('express')
const hbs = require('hbs')
const wax = require('wax-on')


const app = express()
app.set('view engine','hbs')
app.use(express.static('public'))


wax.on(hbs.handlebars)
wax.setLayoutPath('views/layouts')


app.use(express.urlencoded({
    'extended': false
}))


//app route
app.get('/', function(req,res){
    res.send("Hello World")
})

app.get('/fruits', function(req,res){
    res.render('fruits')
})

app.post('/fruits',function(req,res){
    let fruits =[];
    if(req.body.items){
        if(Array.isArray(req.body.items)){
            fruits =  req.body.items
        } else {
            fruits = [req.body.items]
        }
    }
    //   console.log(fruits)
let cost = 0;
let priceChart = {
    'apple' : 3,
    'durian': 15,
    'orange': 6,
    'banana': 4,
}

    // for (let f of fruits) {
    //     cost += priceChart[f] 
    // }

    // if (fruits.includes('apple')) {
    //     cost += 3;
    // }
    // if (fruits.includes('durian')) {
    //     cost += 15;
    // }
    // if (fruits.includes('orange')) {
    //     cost += 6;
    // }
    // if (fruits.includes('banana')) {
    //     cost += 4;
    // }
    
cost = fruits.reduce(function(previous,current){
    return previous + priceChart[current]
},0)

res.send("Total cost is " + cost)
})

// start server
app.listen(3000, function(){
    console.log("server started")
})