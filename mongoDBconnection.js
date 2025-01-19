const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://user1:passW0rd@cluster0.51lmx.mongodb.net/testDB?retryWrites=true&w=majority&appName=Cluster0";

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
      // Send a ping to confirm a successful connection
      await client.db("testDB").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
      const database = client.db("testDB");
     // fetch data
     const userCollection = database.collection("users");
     const query = {};
     // const query = {userId:"101"};
     const options = {};
     const cursor = userCollection.find(query, options);
     await cursor.toArray().then((docs) => {
         console.log(docs); // <- This works and logs all the data to console 
         return docs;
     });
  
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir);
  