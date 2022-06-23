// const express = require('express')
const express = require ('express')
require ('dotenv').config()

const MongoUtil = require('./MongoUtil') // "./"" its same directory as our index.js
const MONGO_URI = process.env.MONGO_URI;
const app = express();
const cors = require('cors')

//enable cross site resource sharing
app.use(cors())
// Restful API aspects data sent to endpoint 
// in json format
// all received data to converted to json
app.use(express.json());

async function main(){

const db =  await MongoUtil.connect(MONGO_URI,"tgc18_food_sightings");
console.log("Connected to database");
app.get('/',function(req,res){
    res.send("hello world")
})

// post cannot be testes via browser
app.post('/food_sightings',async function(req,res){
    let description = req.body.description
    let food = req.body.food
    // when new Date() called with out argument , then it will automatically be current date and time
    let datetime = req.body.datetime? new Date(req.body.datetime): new Date();
    let result = await db.collection('sightings').insertOne({
        'description': description,
        'food': food,
        'datetime': datetime,
    })


    res.status(201)
    res.send(result)
})
app.get('/food_sightings',async function(req,res){
    let criteria = {};
    if(req.query.description){
        criteria['description']={
            '$regex':req.query.description,'$options':'i'
        }
    }
if(req.query.food){
    criteria['food']= {
        '$in':[req.query.food]
    }
}
     let results = await db.collection('sightings').find(criteria)
    res.status(200)
    //toArray is async
    res.send( await results.toArray())
})

//update 
// patch vs put 


}

main();


app.listen(3000, function(){
    console.log("Server has started")
})