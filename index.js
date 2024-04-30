const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 7000;
require('dotenv').config();


// midleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('craft server is runnig');
})

app.listen(port, () => {
  console.log(`Server is running on ${port} port`)
})

const user = process.env.USER;
console.log(user);

//   mongobd
const DBuser = process.env.DB_USER;
const DBpass = process.env.DB_PASS;

const uri = `mongodb+srv://${DBuser}:${DBpass}@cluster0.eugjqa9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const craftCollection = client.db("craftDB").collection('craft')


    // post a new craft
    app.post('/craft', async (req, res) => {
      const newCraft = req.body;
      console.log(newCraft);
      const result = await craftCollection.insertOne(newCraft);
      res.send(result)
    })

    // get a craft from database
    app.get('/craft', async (req, res) => {
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    // user created craft find by email
    app.get('/craft/:email', async (req, res) => {
      const email = req.params.email;
      const query = { userEmail: email };
      const result = await craftCollection.find(query).toArray();
      res.send(result)

    })

    // Delete a craft
    app.delete('/craft/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.deleteOne(query);
      res.send(result)
    })

    // update a craft route
    app.get('/craft-update/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await craftCollection.findOne(query);
      console.log(query);
      res.send(result)
    })

    //put updated data to craft
    app.put(`/craft-update/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCraft = req.body
      const newCraft = {
        $set: {
          item_name: updatedCraft.item_name,
          sub_catagory: updatedCraft.sub_catagory,
          image: updatedCraft.image,
          price: updatedCraft.price,
          rating: updatedCraft.rating,
          time: updatedCraft.time,
          description: updatedCraft.description,
          customaization: updatedCraft.customaization,
          stock: updatedCraft.stock
        }
      };
      const result = await craftCollection.updateOne(query , newCraft, options);
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

