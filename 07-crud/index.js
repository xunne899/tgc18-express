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


app.get('/food_sightings/edit/:food_sighting_id', async function(req,res){
    // 1. we need to WHICH piece of data to edit hence we needs it unique identifier in the URL
    // and we extract it
    let foodSightingId = req.params.food_sighting_id;

    // 2. extract out the current values of that piece of data so that we can populate the form
    let response = await axios.get(BASE_API_URL + 'sighting/' + foodSightingId);
    let foodSighting = response.data;
    console.log(foodSighting.datetime);
    res.render('edit_food_form', {
        'description': foodSighting.description,
        'food': foodSighting.food,
        'datetime': foodSighting.datetime.slice(0,-1)
    })
})


app.post('/food_sightings/edit/:food_sighting_id',async function(req,res){
    let description = req.body.description;
    let food = req.body.food.split(',');
    let datetime = req.body.datetime

    let sightingId = req.params.food_sighting_id;

    let payload = {
        'description': description,
        'food': food,
        'datetime' : datetime
    }
    

    // 4. send the request
    // let url = BASE_API_URL + 'sighting/' + sightingId;
    // console.log("url ====================>", url);
    // await axios.put(url, payload);

    // res.redirect('/')

    await axios.put( BASE_API_URL + 'sighting/' + sightingId, payload)
    res.redirect('/')
})

app.get('/food_sightings/delete/:food_sighting_id', async function(req,res){
    let foodSightingId = req.params.food_sighting_id

    let response = await axios.get(BASE_API_URL + 'sighting/'+ foodSightingId)
    let foodSighting = response.data
    console.log(foodSighting)
res.render('confirm_delete',{
       'foodSighting': foodSighting 
    })
})

app.post('/food_sightings/delete/:food_sighting_id', async function(req,res){
    let foodSightingId = req.params.food_sighting_id
    await axios.delete(BASE_API_URL + 'sighting/' + foodSightingId )
    res.redirect('/')
})

// server to start
app.listen(3000, function(){
    console.log("server started")
})