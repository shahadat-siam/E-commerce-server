const express = require('express');
const cors = require('cors');
require("dotenv").config();
const app = express(); 
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

// ----- middlewere ------ 
const corsOption = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOption));
app.use(express.json());



 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ot34xl4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const userCollection = client.db("MSshop").collection("user"); 
    const productCollection = client.db("MSshop").collection("product"); 
 
    // save user data and role in db
    app.put("/user", async (req, res) => {
        const user = req.body 
        const query = {email: user?.email}
        // check user already exist
        const isExist = await userCollection.findOne(query) 
        if(isExist){
            return res.send(isExist)
        }
        const option = {upsert: true}
        const updateDoc = {
            $set: {
                ...user,
                timestams: Date.now()
            }
        }
        const result = await userCollection.updateOne(query, updateDoc, option)
        res.send(result)
    })

    // check role jeneral user or admin
    app.get("/role-call/:email", async (req, res) => {
      const email = req.params.email;
      // console.log(email)
      const result = await userCollection.findOne({email});
      res.send(result);
    });

    app.post("/product-add", async(req, res) => {
      const productData = req.body
      const result = await productCollection.insertOne(productData)
      res.send(result) 
    })
      
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {  

  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send("MS shop server go on the way");
})

app.listen(port, () => {
    console.log(`MS shop is running on port ${port}`);
})