const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const MongoUtil = require("./MongoUtil.js");
const ObjectId = require('mongodb').ObjectId;
const helpers = require('handlebars-helpers')({
    'handlebars':hbs.handlebars
})
require('dotenv').config();

// use constants to store magic strings 
const DATABASE = "tgc18-animal-shelter";
const PETS = "pets";


async function main() {
  /* 1. SETUP EXPRESS */
  let app = express();

  // 1B. SETUP VIEW ENGINE
  app.set("view engine", "hbs");

  // 1C. SETUP STATIC FOLDER
  app.use(express.static("public"));

  // 1D. SETUP WAX ON (FOR TEMPLATE INHERITANCE)
  wax.on(hbs.handlebars);
  wax.setLayoutPath("./views/layouts");

  // 1E. ENABLE FORMS
  app.use(express.urlencoded({ extended: false }));

  
  
  
  function getCheckboxValues(rawTags) {
    let tags = [];
    if (Array.isArray(rawTags)) {
      tags = rawTags;
    } else if (rawTags) {
      tags = [ rawTags ]
    }
    return tags;
  }
  
  
  
  const db = await MongoUtil.connect(process.env.MONGO_URI, DATABASE);
  console.log("connected to DB");
  
  app.get('/', async function(req,res){
      let pets = await db.collection(PETS).find({}).toArray();
      res.render('all-pets',{
        // if the key name is the same as the variable name, we can just have the variable name    
        //pets
        'pets': pets
      })
  })

  app.get('/create', async function(req,res){
      res.render('add-animals.hbs');
  })

  app.post('/create', async function(req,res){

    // let tags = [];
    // if (Array.isArray(req.body.tags)) {
    //   tags = req.body.tags
    // } else if (req.body.tags) {
    //   tags = [ req.body.tags ]
    // } 
  
    let tags = getCheckboxValues(req.body.tags)
 
      let newDocument = {
          'name': req.body.name,
          'age': req.body.age,
          'breed': req.body.breed,
          'problems': req.body.problems.split(','),
          'hdb_approved':req.body.hdb_approved == 'true',
          'tags': tags
      }

      await db.collection(PETS).insertOne(newDocument);
      res.redirect('/')
  })


 // get pets through id 
app.get('/:petid', async (req,res)=> {
    // let db = MongoUtil.getDB();
    let pets = await db.collection(PETS).findOne({
        '_id': ObjectId(req.params.petid)
    });
    
    res.render('selected-pets', {
        pets
    })  
  })
  

  app.post('/:petid', async (req,res)=> {
    // let db = MongoUtil.getDB();
    let pets = await db.collection(PETS).findOne({
        '_id': ObjectId(req.params.petid)
    });
    
    res.render('selected-pets', {
        pets
    })  
  })
  

// get edit food
app.get('/:petid/edit', async (req,res)=> {
    // let db = MongoUtil.getDB();
    let pets = await db.collection(PETS).findOne({
        '_id': ObjectId(req.params.petid)
    });
    
    res.render('edit-pets', {
        pets
    })  
  })
  
  
  // post edit food
  app.post("/:petid/edit", async (req,res)=>{
    // let db = MongoUtil.getDB();

    let id = req.params.petid;
    // let { name, age, breed, problems,hdb_approved, tags } = req.body;
    let newDocument = {
        'name': req.body.name,
        'age': req.body.age,
        'breed': req.body.breed,
        'problems': req.body.problems.split(','),
        'hdb_approved':req.body.hdb_approved == 'true',
        'tags': getCheckboxValues(req.body.tags)
    }
  
    // if (tags=null) {
    //     tags = [];
    // }
    // if (!tags) {
    //     tags = [];
    // }
    // if (!Array.isArray(tags)) {
    //     tags = [tags];
    // }
  

    await db.collection(PETS).updateOne({
        _id:ObjectId(id)
    }, 
    {
        // '$set' : {
        //     name, age, breed, problems, hdb_approved,tags
        // }    
        
        '$set': newDocument


    })
  
    res.redirect('/');
  })



  app.get('/delete-animals/:petid', async function(req,res){
    let id = req.params.petid;
    let  pets = await db.collection(PETS).findOne({
        '_id': ObjectId(id)
    })
    res.render('delete-animals',{
        'pets': pets
    })
})

app.post('/delete-animals/:petid',async function(req,res){
    let id = req.params.petid;
    await db.collection(PETS).deleteOne({
    '_id':ObjectId(id)
})
res.redirect('/')
})
  



  // post edit food
//   app.post("/food/:foodid/edit", async (req,res)=>{
//     let db = MongoUtil.getDB();
//     let { foodName, calories, tags } = req.body;
  
//     if (!Array.isArray(tags)) {
//         tags = [tags];
//     }
  
//     let foodid = req.params.foodid;
//     db.collection('food').updateOne({
//         _id:ObjectId(foodid)
//     }, 
//     {
//         '$set' : {
//           foodName, calories, tags
//         }        
//     })
  
//     res.redirect('/food');
//   })








  app.listen(3001, function(){
    console.log("Server has started")
});

}

main();





