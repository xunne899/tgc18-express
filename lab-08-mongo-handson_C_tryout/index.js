const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const MongoUtil = require("./MongoUtil.js")
const ObjectId = require('mongodb').ObjectId;
const helpers = require('handlebars-helpers')({
    'handlebars':hbs.handlebars
})
require('dotenv').config()

const DATABASE = "tgc18-fault-report"
const FAULTS = "faults"


async function main(){



    let app = express()


    async function getFaultRecordById(id) {
        let faultRecord = await db.collection(FAULTS).findOne({
            '_id': ObjectId(id)
        });
        return faultRecord;
    }


app.set("view engine", "hbs");

app.use(express.static("public"))

wax.on(hbs.handlebars);

wax.setLayoutPath("./views/layouts")

app.use(express.urlencoded({ extended: false}))


function checboxValues(ticks){
    let tags = [];
    if(Array.isArray(ticks)){
        tags = ticks
    }  else if(ticks){
        tags = [ticks]
    }
    return tags
}

const db = await MongoUtil.connect(process.env.MONGO_URI,DATABASE)
console.log(db)

app.get('/', async function(req,res){
    let faults = await db.collection(FAULTS).find({}).toArray();
    res.render('all-faults',{

        'faults':faults
    })
})


app.get('/create',async function(req,res){
    res.render('add-faults')
})


app.post('/create', async function(req,res){

    let tags = checboxValues(req.body.tags)
  
    let newinfo = {
        'title': req.body.title,
        'location':req.body.location.split(','),
        'tags': tags,
        'block':req.body.block,
        'name':req.body.name,
        'email':req.body.email
    }

    await db.collection(FAULTS).insertOne(newinfo);
    res.redirect('/')
})
    
/* <h5 class="card-title">{{this.title}}</h5>
<ul>
    <li>ID:{{this._id}}</li>
    <li>Location: {{this.location}}</li>
    <li>Tags: {{this.tags}}</li>
    <li>Block: {{this.block}}</li>
    <li>Name: {{this.name}}</li>
    <li>Email: {{this.email}}</li>
</ul> */
app.get('/:id/edit',async (req,res)=>{
    let faults = await db.collection(FAULTS).findOne({
        '_id':ObjectId(req.params.id)
    })

    res.render('edit-faults',{
       faults
    })
})

app.post('/:id/edit',async(req,res)=>{
 let id =req.params.id
 let tags = checboxValues(req.body.tags)
 let newinfo = {
    'title': req.body.title,
    'location':req.body.location,
    'tags': tags,
    'block':req.body.block,
    'name':req.body.name,
    'email':req.body.email
}

await db.collection(FAULTS).updateOne({
    _id:ObjectId(id)

},{
    '$set':newinfo
})

res.redirect('/')
})




app.get('/delete-faults/:id', async function(req,res){
    let id = req.params.id;
    let  faults = await db.collection(FAULTS).findOne({
        '_id': ObjectId(id)
    })
    res.render('delete-faults',{
        faults
    })
})

app.post('/delete-faults/:id',async function(req,res){
    let id = req.params.id;
    await db.collection(FAULTS).deleteOne({
    '_id':ObjectId(id)
})
res.redirect('/')
})



app.get('/faults/:id/comment/add', async function(req,res){
 let faults = await db.collection(FAULTS).findOne({
    '_id':ObjectId(req.params.id)
 },{
    'projection':{
        'title':1
    }
 }) 

 res.render('add-comment',{
    faults
 })
})

app.post('/faults/:id/comment/add',async function(req,res){
    await db.collection(FAULTS).updateOne({
        '_id':ObjectId(req.params.id)
    },{
        '$push':{
            'comments':{
                '_id':ObjectId(),
                'content' :req.body.content
            }
        }
    })

    res.redirect('/faults/'+req.params.id+'/comment')
})



app.get('/faults/:id/comment', async function(req,res){
    let faults = await getFaultRecordById(req.params.id);
   res.render('show-comment',{
    faults
   })
})


app.get('/faults/:fauid/comment/:comid/update', async function(req,res){
    // let foodRecord = await db.collection('food_records').findOne({
    //     '_id': ObjectId(req.params.foodid),
    // },{
    //     'projection':{
    //         'notes':{
    //             '$elemMatch':{
    //                 '_id': ObjectId(req.params.noteid)
    //             }
    //         }
    //     }
    // });

    let faults = await db.collection(FAULTS).findOne({
        '_id': ObjectId(req.params.fauid),
        'comments._id': ObjectId(req.params.comid)
    },{
        'projection':{
            'comments.$': 1
        }
    })

    let commentToEdit = faults.comments[0];
    res.render('edit-comment',{
        'content': commentToEdit.content
    })
})

app.post('/faults/:fauid/comment/:comid/update', async function(req,res){
    let newContent = req.body.content;
    await db.collection(FAULTS).updateOne({
        '_id':ObjectId(req.params.fauid),
        'comments._id':ObjectId(req.params.comid)
    },{
        '$set':{
            'comments.$.content': newContent
        }
    })
    res.redirect(`/faults/${req.params.id}/comment`);
});

app.get('/faults/:fauid/comment/:comid/delete', async function(req,res){
    let faults = await db.collection(FAULTS).findOne({
        '_id': ObjectId(req.params.fauid),
        'comments._id': ObjectId(req.params.comid)
    },{
        'projection':{
            'comments.$': 1
        }
    })

    let commentToDelete= faults.comments[0];
    res.render('delete-comment',{
        'comments': commentToDelete 
    })
})

app.post('/faults/:fauid/comment/:comid/delete', async function(req,res){
    await db.collection(FAULTS).updateOne({
        '_id':ObjectId(req.params.fauid)
    },{
        '$pull':{
            'comments':{
                '_id': ObjectId(req.params.comid)
            }
        }
    })
    res.redirect('/faults/'+req.params.fauid+'/comment')
})



app.listen(3001, function(){
    console.log("Server has started")
});


}
main();