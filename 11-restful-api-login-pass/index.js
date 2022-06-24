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


const dummyMiddleware = function(req,res,next){
    req.date = new Date();
    //
    next()//!important all middleare needs to call the net function 
    console.log('Dummy')
}

app.use(dummyMiddleware)


const checkIfAuthenticatedWithJWT = function(req,res,next) {
    // check if there is an authorization header
    let authorizationHeaders = req.headers.authorization;
    if (!authorizationHeaders) {
        res.sendStatus(401);
        return;
    }

    console.log('Authorization headers=', authorizationHeaders);
    let token = authorizationHeaders.split("")[1];
    jwt.verify(token,process.env.TOKEN_SECRET,function(err,tokenData){
        if(err){
            res.sendStatus(401); //res.status + res.send
            return // to end function
        }else{
            req.user = tokenData;
        }
       
})
next()
}

async function main(){

const db =  await MongoUtil.connect(MONGO_URI,"tgc18_food_sightings_jwt");
console.log("Connected to database");
app.get('/',function(req,res){
    res.send("hello world")
})

// post cannot be testes via browser
//protect this route
//
app.post('/food_sightings', checkIfAuthenticatedWithJWT, async function(req,res){



    let description = req.body.description
    let food = req.body.food
    // when new Date() called with out argument , then it will automatically be current date and time
    let datetime = req.body.datetime? new Date(req.body.datetime): new Date();
    let result = await db.collection('sightings').insertOne({
        'description': description,
        'food': food,
        'datetime': datetime,
        'owner': ObjectId(req.user.user_id)
    })
    res.status(201)
    res.send(result)
})


app.get('/food_sightings', dummyMiddleware, async function(req,res){
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
app.put('/food_sightings/:id', checkIfAuthenticatedWithJWT, async function(req,res){
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
app.delete('/food_sightings/:id', checkIfAuthenticatedWithJWT , async function(req,res){
    let results = await db.collection('sightings').deleteOne({
        '_id':ObjectId(req.params.id)
    })

    res.status(200);
    res.json({'status':'ok'});
})

//user sign up 
// for user signup, need user email and password
//post => creating
// if end point is pot/user => creating new users
app.post('/users', async function(req,res){
    let newUser ={
        'email': req.body.email,
        'password': req.body.password
    }

    await db.collection('users').insertOne(newUser);
    res.status(201);
    res.json({'message': "New user created successfully!"})

})

//restful api- url suggest dealing with resource
// when login, client must pass the password and email
app.post('/login',async function(req,res){
// attempt to find a document with same password and email again
let user = await db.collection('users').findOne({
    'email': req.body.email,
    'password' : req.body.password
})

if(user){
    let token =jwt.sign({
        'email':req.body.email,
        'user_id':user._id
    },process.env.TOKEN_SECRET,{
        'expiresIn': '15m'
    });

    res.json({
        'accessToken':token
    })
} else{
    res.status(401);
    res.json({
        'message':"Invalid password or email"
    })
}

})


}

main();


app.listen(3000, function(){
    console.log("Server has started")
})