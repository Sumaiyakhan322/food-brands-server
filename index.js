const express = require('express')
const cors = require('cors')
require('dotenv').config();
const app = express()
const port=process.env.PORT || 5000
//middlewares
app.use(cors())
app.use(express.json())

//VFeZ5Zc04GSWWdd3
//brandShop
// const uri = "mongodb+srv://<username>:<password>@cluster0.ej2tmfe.mongodb.net/?retryWrites=true&w=majority";


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ej2tmfe.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const productCollection=client.db('ProductDB').collection('Product')

    //add a product
    app.post('/products',async(req,res)=>{
        const newProduct=req.body;
        const result=await productCollection.insertOne(newProduct)
        res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
