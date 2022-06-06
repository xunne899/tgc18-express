// const means never changes - short for constant
const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const axios = require('axios');

// give me a new instance of an express application
// the `app` variable shouldn't be changed
const app = express();

// setup the view engine
app.set('view engine', 'hbs');
app.use(express.static('public'));

// setup wax on so that it will works with hbs
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')

// ROUTES HERE

const BASE_API_URL="https://ckx-restful-api.herokuapp.com"; // --> see note 1

 

app.get("/", async (req, res) => {
  let response = await axios.get(BASE_API_URL + "sightings"); // --> note 2
  let sightings = response.data;
  res.render('index', {
    'sightings': sightings // --> note 3
  })
});

// create
app.get('/create', async(req,res)=>{
  res.render('create_sighting.hbs');
})

// post 
app.post('/create', async(req,res)=>{
  let sighting = {
    'description': req.body.description,
    'food': req.body.food.split(','),
    'datetime': req.body.datetime
  }

  await axios.post(BASE_API_URL + 'sighting', sighting);
  res.redirect('/')
})
// update
app.get('/:sighting_id/update', async(req,res)=>{
  let response = await axios.get(BASE_API_URL + '/sighting/' + req.params.sighting_id);
  let sighting = response.data;
  sighting.datetime = sighting.datetime.slice(0, -1);
  res.render("update_sighting",{
    'sighting': sighting
  })

  await axios.put(BASE_API_URL + '/sighting/' + req.params.sighting_id, sighting);
  res.redirect('/')
})

// END ROUTES

app.listen(3000, ()=>{console.log("Server started")});
