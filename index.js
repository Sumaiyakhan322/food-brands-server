const express = require('express')
const cors = require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port=process.env.PORT || 5000
//middlewares
app.use(cors())
app.use(express.json())



app.get('/',(req,res)=>{
    res.send('brand server is running')
})
app.listen(port,()=>{
    console.log(`${port}`);
})

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
    // await client.connect();
    const productCollection = client.db("ProductDB").collection("Product");
    const UserAddProductCollection = client.db("UserDB").collection("UserADDProduct");
    ;

    //add a product
    app.post('/products',async(req,res)=>{
        const newProduct=req.body;
        console.log(newProduct);
        const result=await productCollection.insertOne(newProduct);
        res.send(result)
    })

    //get all the products
    app.get('/products',async(req,res)=>{
      const cursor=productCollection.find();
      const result=await cursor.toArray();
      res.send(result);
 })

 //update a product
 app.get('/products/:id',async(req,res)=>{
  const id=req.params.id;
  const query={_id :new ObjectId(id)}
  const result =await productCollection.findOne(query);
  res.send(result)

 })
 //put update the product
 app.put('/products/:id',async(req,res)=>{
  const id=req.params.id;
  const filter={_id:new ObjectId(id)}
  const options={upset:true}
  const updateProduct=req.body;
  const product={
    $set:{
      name:updateProduct.name,
       brandName:updateProduct.brandName,
       img:updateProduct.img,
       type:updateProduct.type,
       price:updateProduct.price,
       rating:updateProduct.rating,
       des:updateProduct.des,
    }
  }
  const result=await productCollection.updateOne(filter,product,options)
  res.send(result);
 })
 //delete a product
 app.delete('/products/:id',async(req,res)=>{
  const id=req.params.id;
  const query={_id:new ObjectId(id)}
  const result=await productCollection.deleteMany(query)
  res.send(result)
 })
//add cart products
 app.post('/usersProducts',async(req,res)=>{
  const newProduct=req.body;
  
  const result=await UserAddProductCollection.insertOne(newProduct);
  res.send(result);
})
app.get('/usersProducts',async(req,res)=>{
  const cursor=UserAddProductCollection.find();
  const result=await cursor.toArray();
  res.send(result);

}
)


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
