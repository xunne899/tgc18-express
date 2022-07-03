// const express = require('express')
const express = require ('express')
require ('dotenv').config()

const MongoUtil = require('./MongoUtil') // "./"" its same directory as our index.js
const MONGO_URI = process.env.MONGO_URI;
const app = express();
const cors = require('cors');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken')

//enable cross site resource sharing
app.use(cors())
// Restful API aspects data sent to endpoint 
// in json format
// all received data to converted to json
app.use(express.json());

async function main(){

const db =  await MongoUtil.connect(MONGO_URI,"food_sightings_JWT");
console.log("Connected to database");
app.get('/',function(req,res){
    res.send("hello world")
})

// post cannot be testes via browser
//protect the route(deny unauthorised user)
// provide a way for accesstoken 
app.post('/food_sightings',async function(req,res){
   
   let authorizationHeaders = req.headers.authorization;
   if(!authorizationHeaders){
    res.sendStatus(401);
    return;// return is to end function
   }
   console.log("Authorization headers",authorizationHeaders)
   let token = authorizationHeaders.split(" ")[1]
   jwt.verify(token,process.env.TOKEN_SECRET,function(err,tokenData){
    if(err){
        res.sendStatus(401)
    } else(
        req.user = tokenData
    )
   })
 

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
app.put('/food_sightings/:id',async function(req,res){
    let description = req.body.description;
    let food = req.body.food;
    let datetime = req.body.date ? new Date(req.body.date) : new Date();
    let results = await db.collection('sightings').updateOne({
        '_id' : ObjectId(req.params.id)
    },{
        '$set':{
            'description': description,
            'food':food,
            'datetime': datetime
        }
    })
    res.status(200);
        res.json(results);
})

// delete
app.delete('/food_sightings/:id', async function(req,res){
    let results = await db.collection('sightings').deleteOne({
        '_id':ObjectId(req.params.id)
    })

    res.status(200);
    res.json({'status':'ok'});
})


//user signup 
// creating new users
//req.body contains 'psw' and 'email'
app.post('/users', async function(req,res){
    let newUser ={
        'email': req.body.email,
        'password': req.body.password
    }
    await db.collection('users').insertOne(newUser);
    res.status(201);
    res.json({
        'message':"New user created successfully"
    })
})

//restful api
// create a temp piece of of web token  
// user login pass us  the password and email 
app.post('/login',async function(req,res){

    let user = await db.collection('users').findOne({
        'email':req.body.email,
        'password': req.body.password
    })
//only if user is not undefined or null , if user exists and found
    if(user){
        //token can store data
        let token = jwt.sign({
            'email':req.body.email,
            'user_id':user._id
        },process.env.TOKEN_SECRET,{
            'expiresIn': '15m'
        });
        res.json({
            'accessToken': token
        })
    } else{
        res.status(401);
        res.json({
            'message':"Invalid email or password"
        })
    }

})

}

main();


app.listen(3000, function(){
    console.log("Server has started")
})