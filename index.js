const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zku3u3r.mongodb.net/?retryWrites=true&w=majority`;

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

    const productCollection = client.db('productsDB').collection('products');
    const cart = client.db('productsDB').collection('cart')

    // get all products of specific brand 
    app.get('/products/:brand', async (req, res) => {
      const brand = req.params.brand;
      const query = {brandName: brand}
      const cursor = productCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })

    // get single products depends on specific id
    app.get('/product_details/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const filter = {_id: new ObjectId(id)}
      const result = await productCollection.findOne(filter)
      res.send(result)
    })

    // get all products
    app.post('/products', async (req, res) =>{
      const newProduct = req.body;
      console.log(newProduct)
      const result = await productCollection.insertOne(newProduct)
      res.send(result)
    })

    // update specific product
    app.patch('/products/:id', async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updateDoc = {
        $set: {
          name: updatedProduct.name,
          brandName: updatedProduct.brandName,
          type: updatedProduct.type,
          price: updatedProduct.price,
          rating: updatedProduct.rating,
          image: updatedProduct.image,
        }
      }
      const result = await productCollection.updateOne(filter, updateDoc, options)
      res.send(result)
    })

    // read all products of cart
    app.get('/cart', async (req, res) => {
      const cursor = cart.find()
      const result = await cursor.toArray()
      res.send(result)
    })


    // add to cart
    app.post('/cart', async (req, res) => {
      const product = req.body;
      console.log(product)
      const result = await cart.insertOne(product)
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


app.get('/', (req, res) => {
    res.send('Tech Hub server is running')
})

app.listen(port, () => {
    console.log(`TechHub server is running on port: ${port}`)
})