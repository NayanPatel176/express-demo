const { MongoClient } = require('mongodb')
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = process.env.MONGODB_URL
const client = new MongoClient(url)

// Database Name
const dbName = process.env.MONGODB_NAME
let db = ''
const main = async () => {
    if(db) return db
    // Use connect method to connect to the server
    await client.connect()
    console.log('Connected successfully to server')
    db = await client.db(dbName)
    // console.log('db: ', db)
    // const collection = await db.collection('team').find({}).toArray()
    // console.log('collection: ', collection)

    // the following code examples can be pasted here...

    return 'done.'
}

const get = () => {
    return db
} 

module.exports = {
    main,
    get
}
