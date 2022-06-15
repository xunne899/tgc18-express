// mongo client contains mongo objects
const MongoClient = require('mongodb').MongoClient;

async function connect(mongoUri,dbName){

    const client = await MongoClient.connect(mongoUri,{
        'useUnifiedTopology': true
    })
// connect to respective mongo database    
const db = client.db(dbName);
return db;
}


//export out connect  so other files can use
//
module.exports = {
    connect
}