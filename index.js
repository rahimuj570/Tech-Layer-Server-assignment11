const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

// ======== Middleware =========
app.use(cors());
app.use(express.json());

// ======== Connect DB ========
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.l4ucy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const productCollection = client.db("productsData").collection("product");

    // ========= Show API =======
    app.get("/", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const product = await cursor.toArray();
      res.send(product);
    });

    // ========= Add API =======
    app.get("/add", async (req, res) => {
      const data = req.body;
      const result = productCollection.insertOne(data);
      res.send(result);
    });

    // ========= Specific Product API =======
    app.get("/user/:rating", async (req, res) => {
      const rating = req.params;
      const query = { rating: rating.rating };
      const cursor = await productCollection.find(query);
      const product = await cursor.toArray();
      res.send(product);
    });

    // ========= Delete Product API =======
    app.get("/delete/:rating", async (req, res) => {
      const rating = req.params;
      const query = { rating: rating.rating };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    //
  } finally {
  }
}
run().catch(console.dir);

// ========== Listening =======
app.listen(port, () => {
  console.log("Listening to port", port);
});
