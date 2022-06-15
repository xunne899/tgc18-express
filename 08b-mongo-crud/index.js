const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
// we need the ./ in front our own custom modules
// because without it, NodeJS will assume that
// we are requiring from the node_modules folder
// const {connect} = require('./MongoUtil');
//./ to indicate from current folder
const MongoUtil = require('./MongoUtil')


// dotenv
// a dotenv files also to create variables
// when we run config on the dotenv, all variables defined in the .env file
// are transfered to the environment
const dotenv = require('dotenv').config();

// process is a NodeJS object automatically available to all NodeJs programs
// BE SURE NOT TO NAME ANY VARIABLES AS `process`
// the process variable refers to the current NodeJS that is running
// .env is the environment -- it is where the operating system stores its variables
// console.log(process.env);


const app = express();
app.set('view engine', 'hbs'); // tell express we are using hbs as the view engine
wax.on(hbs.handlebars);  // setup template inheritance
wax.setLayoutPath('./views/layouts');

// so that submitted form content will be inside req.body
app.use(express.urlencoded({
    extended: false
}));

const MONGO_URI = process.env.MONGO_URI;


async function main() {
  
    const db = await MongoUtil.connect(MONGO_URI, "tgc18_cico");
    app.get('/test', async function(req,res) {
        // we use the .toArray() to convert the results to an array of JavaScript objects
        let data = await db.collection('listingsAndReviews').find({}).limit(10).toArray();
        res.send(data);
    });

    app.get('/', async function (req, res) {
        const allFoodRecords = await db.collection('food_records')
                                 .find({}) 
                                 .toArray();

        res.render('all-food.hbs',{
            'allFood': allFoodRecords
        })
    })

    // one route to display the form
    app.get('/add-food', function(req,res){
        res.render('add-food.hbs');
    })

    // one route to process the form
    app.post('/add-food', async function(req,res){
        let foodRecordName = req.body.foodRecordName;
        let calories = req.body.calories;
        let tags = [];
        if (Array.isArray(req.body.tags)) {
            tags = req.body.tags;
        } else if (req.body.tags) {
            tags = [ req.body.tags ];
        }

        let foodDocument = {
            'food': foodRecordName,
            'calories': calories,
            'tags': tags
        };

        await db.collection('food_records').insertOne(foodDocument);
        res.redirect("/");

    })
}
main();


app.listen(3000, function () {
    console.log("hello world");
})