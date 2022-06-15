const express = require('express');
const hbs = require ('hbs');
const wax = require('wax-on');
// mongo client conatains mongo objects
const MongoClient = require('mongodb').MongoClient;

// env is the environment  where operating systems stores its variables
// when we run config  on dotenv all vars are transferred to environment
const dotenv = require('dotenv').confiq();
console.log(process.env)

const app = express();
// to explicitly tell express to use hbs as view engine instead of other view engine
app.set('view engine','hbs')
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')

const MONGO_URI = process.env.MONGO_URI;

async function main(){
    // 1connection string //  2options object
    const client = await MongoClient.connect(MONGO_URI,{
        'useUnifiedTopology': true
    })


// connect to respective mongo database    
const db = client.db('sample_airbnb')
// go to the respective route
app.get('/test', async function(req,res){
    // use toArray() to convert results to an array of js objects
 let data = await db.collection('listingsAndReviews').find({}).limit(10).toArray();
 res.send(data)
})

app.get('/', function(req,res){
    res.render('hello.hbs')
})


}


main();
app.listen(3000, function(){
    console.log("hello world");
})

