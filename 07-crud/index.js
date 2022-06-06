const express = require('express')
const hbs = require('hbs')
const wax = require('wax-on')
const axios = require('axios')


const app = express()
app.set('view engine','hbs')
app.use(express.static('public'))


wax.on(hbs.handlebars)
wax.setLayoutPath('views/layouts')

//forms
app.use(express.urlencoded({
    'extended': false
}))

const BASE_API_URL = 'https://ckx-restful-api.herokuapp.com/';

//app route
app.get('/', async function(req,res){
    let response = await axios.get(BASE_API_URL + 'sightings')
    // res.send(response.data)
    res.render('sightings',{
        'foodSightings' : response.data
    })
})

app.get('/food_sightings/create',function(req,res){
    res.render('food_form')
})


// app.post('/food_sighting/create', function(req,res){
//     res.send(req.body);
// })


app.post('/food_sightings/create', async function(req,res){
    let data = {
        'description': req.body.description,
        'food': req.body.food.split(','),
        'datetime': req.body.datetime
    }
    await axios.post(BASE_API_URL + "sighting", data);
    res.redirect('/');
})

app.listen(3000, function(){
    console.log("server started")
})