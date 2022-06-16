const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');

const MongoUtil = require('./MongoUtil')



const dotenv = require('dotenv').config();



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
  
    const db = await MongoUtil.connect(MONGO_URI, "animal_newshelter");
    app.get('/test', async function(req,res) {
        // we use the .toArray() to convert the results to an array of JavaScript objects
        let data = await db.collection('listingsAndReviews').find({}).limit(10).toArray();
        res.send(data);
    });

    app.get('/', async function (req, res) {
        const allAnimalsRecords = await db.collection('animal_records')
                                 .find({}) 
                                 .toArray();

        res.render('all-animals.hbs',{
            'allAnimals': allAnimalsRecords
        })
    })

   // one route to display the form
   app.get('/add-animals', function(req,res){
    res.render('add-animals.hbs');
})


app.post('/add-animals', async function(req,res){
    let name = req.body.name;
    let breed = req.body.breed;
    let age = req.body.age;
    let description = req.body.description;
    let tags = [];
    if (Array.isArray(req.body.tags)) {
        tags = req.body.tags;
    } else if (req.body.tags) {
        tags = [ req.body.tags ];
    }

    let animalDocument = {
        'name': name,
        'breed': breed,
        'age': age,
        'description': description,
        'tags':tags
    };

    await db.collection('animal_records').insertOne( animalDocument);
    res.redirect("/");

})

}
main();


app.listen(3000, function () {
    console.log("hello world");
})








