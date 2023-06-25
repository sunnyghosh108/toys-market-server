const express =require('express');
const cors =require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app =express();
const port = process.env.PORT || 5000;

// middleWare
  app.use(cors());
 app.use(express.json());

const corsConfig = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
  app.use(cors(corsConfig))
  app.options("", cors(corsConfig))





//console.log(process.env.DB_PASS);



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

    const database = client.db("toysMarket");
    const allToysCollection = database.collection("allToysCollection");
    

    // jungoree
    app.get('/myToys', async (req, res) => {
      let query = {}
      const sorting = req.query.srt

      if (req?.query?.email) {
          query = { seller_email: req.query.email }
      }


      if (sorting) {
       

          const result = await allToysCollection.find(query).sort({ price: sorting }).toArray()
          res.send(result)
      }
      else {

          const result = await allToysCollection.find(query).toArray()
          res.send(result)
      }
  


  })


  app.get('/allToys/:text', async (req, res) => {
      const currentPage = parseInt(req?.query?.page) || 0
      const itemsPerPage = parseInt(req?.query?.limit) || 5 
      const skip = currentPage * itemsPerPage
    
      console.log(itemsPerPage)
      const searchText = req?.params?.text
    

      if (searchText == '1') {
         console.log('this is array')
          const result = await allToysCollection.find().skip(skip).limit(itemsPerPage).toArray()
          res.send(result)

      }
      else {
          const result = await allToysCollection.find({ toy_name: searchText }).toArray()
          res.send(result)
      }


  

  })



  app.get('/allToysImg', async (req, res) => {
      const result = await allToysCollection.find().toArray()

      res.send(result)


  })



  app.get('/allToysTabs', async (req, res) => {
      const result = await allToysCollection.find().toArray()

      res.send(result)


  })

  app.get('/singleToys/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const result = await allToysCollection.findOne(filter)
      res.send(result)
  

  })


  app.post('/addToys', async (req, res) => {
      const body = req.body

      const result = await allToysCollection.insertOne(body)
      res.send(result)
  })



  app.patch('/update/:id', async (req, res) => {
      const updateDetails = req.body
      
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const updated = {
          $set: {
              price: updateDetails.price,
              description: updateDetails.description,
              available_quantity: updateDetails.available_quantity
          }
      }
      const result = await allToysCollection.updateOne(filter, updated)
      res.send(result)
  })



  // app.delete('/remove/:id', async (req, res) => {
  //     const id = req.params.id
  //     const query = { _id: new ObjectId(id) }
  //     const result = await allToysCollection.deleteOne(query)
  //     res.send(result)
  // })





  // pagination 

  app.get('/toysQuantity', async (req, res) => {
      const result = await allToysCollection.estimatedDocumentCount()
      res.send({ toysQuantity: result })
  })

    //end jungoree
  
    app.get('/products',async(req,res)=>{
      const cursor =productsCollecton.find();
      const result =await cursor.toArray();
      res.send(result);
    })
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }


      const result = await productsCollecton.findOne(query);
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
    // await client.db("admin").command({ ping: 1 });
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