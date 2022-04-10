const express = require('express');
const res = require('express/lib/response');
const app = express();
require('dotenv').config();
const cors = require('cors');
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
const port = 5000

//middleware

app.use(cors())
app.use(express.json())

//connect URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.riphr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log('mongouri',uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('letterManagement');
        const UsersCollection = database.collection('users');

        //get all user
        app.get('/users', async (req,res) => {
            const result = await UsersCollection.find({}).toArray();
            console.log(result);
            res.send(result);
        })
        //get single user
        app.get('/user/:id', async (req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await UsersCollection.findOne( query ); 
            res.send(result);
        })
        //added new user
        app.post('/user', async (req,res) => {
            const data = req.body;
            console.log(data);
            const result = await UsersCollection.insertOne(data);
            res.send(result.acknowledged);
            console.log('new user added');
        })
        //update new user
        app.put('/user', async (req,res) =>{
            // const email = req.params.email;
            // const filter = {email: email};
            // const option = {upsert: false};
            // const updateDoc = {
            //     $set : {
            //         name: req.params.name,
            //         password: req.params.password 
            //     },
            // };
            const email = req.body.email;
            const filter = {email: email};
            const option = {upsert: false};
            const updateDoc = {
                $set : {
                    name: req.body.name,
                    password: req.body.password 
                },
            };
            const result = await UsersCollection.updateOne(filter,updateDoc,option);
            res.send(result);

        })
        //delete new user
        app.delete('/user/:id', async (req,res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await UsersCollection.deleteOne(query);
            res.send(result);
            console.log('user delete successfull');
        })


        console.log("Connected successfully to server");
    } finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', async (req,res) => {
    res.send('Ashadul Mridha');
})

app.listen( port , () => {
    console.log(`Example app listening on port ${port}`)
})