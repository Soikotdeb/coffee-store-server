const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express();
 const port = process.env.PORT || 5000;


//  middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e1mdmag.mongodb.net/?retryWrites=true&w=majority`;
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

    const coffeeCollection=client.db('coffeeDb').collection('coffee');


    app.get('/coffee',async(req,res)=>{
const cursor = coffeeCollection.find();
const  result = await cursor.toArray();
res.send(result)
    })


    // update data
app.get('/coffee/:id',async(req,res)=>{
const id = req.params.id;
const query ={_id: new ObjectId(id)}
const result = await coffeeCollection.findOne(query)
res.send(result)
})

app.put('/coffee/:id', async(req, res)=>{
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)}
  const options = {upsert:true};
  const updatedCoffee = req.body;

  const Coffee = {
    $set:{
      name :updatedCoffee.name, 
       quantity: updatedCoffee.quantity,
        supplier:updatedCoffee.supplier,
         taste:updatedCoffee.taste, 
         category: updatedCoffee.category,
          details:updatedCoffee.details,
           photo:updatedCoffee.photo 
    }
  }
  const result = await coffeeCollection.updateOne(filter, Coffee,options)
res.send(result)
})


//1 data recive and send response
app.post('/coffee', async(req,res)=>{
    const newCoffee = req.body;
    console.log(newCoffee)
    const result = await coffeeCollection.insertOne(newCoffee)
    res.send(result)
})

// delate specific  data 
app.delete('/coffee/:id', async(req,res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}
  const result = await coffeeCollection.deleteOne(query);
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




app.get('/',(req,res)=>{
  res.send('coffee making server  is  running ')
})

app.listen(port, ()=>{
    console.log(`coffee server is running port ${port} `);
})