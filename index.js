const express =require('express');
const cors =require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app =express();
const port = process.env.PORT || 5000;

// middleWare
   app.use(cors());
// const corsConfig = {
//   origin: '',
//   credentials: true,
//   methods: [ 'GET', 'POST', 'PUT', 'DELETE']
// }

// app.use(cors(corsConfig))
// app.options("", cors(corsConfig))

// const corsConfig = {
//   origin: '*',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE']
//   }
//   app.use(cors(corsConfig))
//   app.options("", cors(corsConfig))


app.use(express.json());


console.log(process.env.DB_PASS);



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o4ydcux.mongodb.net/?retryWrites=true&w=majority`;

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

    const productsCollecton=client.db('toysMarket').collection('products');

    // 
    const indexKeys = { name: 1, category: 1 }; 
    const indexOptions = { name: "titleCategory" }; 
    const result = await productsCollecton.createIndex(indexKeys, indexOptions);
    console.log(result);

    app.get("toysSearchByTitle/text",async(req,res)=>{
      const searchText =req.params.text;    
      const result = await productsCollecton.aggregate.find({
        $or:[
          {name:{$regex:text,$options:"i"}},
          {category:{$regex:text, $options:"i"}},
        ],
      })
      .toArray();
      res.send(result);
    })


    app.put("/products/:id",async(req,res)=>{
      const id = req.params.id;
      const body = req.body;
      console.log(body);
      const filter ={_id:new ObjectId(id)};
      const updateDoc ={
        $set:{
          photo:body.photo,
          seller:body.seller,
          category:body.category,
        },
      };
      const result =await productsCollecton.updateOne(filter,updateDoc);
      res.send(result);
    });

    // 
  
    app.get('/products',async(req,res)=>{
      const cursor =productsCollecton.find();
      const result =await cursor.toArray();
      res.send(result);
    })

    app.post('/products',async(req,res)=>{
        const newToys = req.body;
        console.log(newToys);
        const result =await productsCollecton.insertOne(newToys);
        res.send(result);
    })
    //bookings
    app.get('/products', async(req,res)=>{
      console.log(req.query.email);
      let query = {};
      if (req.query?.email){
        query = {email:req.query.email}
      }

      const result =await productsCollecton.find().toArray();
      res.send(result);
    })
    // 
    
    // bookings routes
  //   app.get('/products', async (req, res) => {
  //     const decoded = req.decoded;
    
  //     let query = {};
  //     if (req.query?.email) {
  //         query = { email: req.query.email }
  //     }
  //     const result = await bookingCollection.find(query).toArray();
  //     res.send(result);
  // })

  // app.post('/products', async (req, res) => {
  //     const booking = req.body;
  //     console.log(booking);
  //     const result = await bookingCollection.insertOne(booking);
  //     res.send(result);
  // });
  

  app.patch('/products/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedBooking = req.body;
      console.log(updatedBooking);
      const updateDoc = {
          $set: {
              status: updatedBooking.status
          },
      };
      const result = await productsCollecton.updateOne(filter, updateDoc);
      res.send(result);
  })

  app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productsCollecton.deleteOne(query);
      res.send(result);
  })


  //  
    


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('boy is playing with toy')
})

app.listen(port,()=>{
    console.log(`boy is playing with toy on port ${port}`)
})