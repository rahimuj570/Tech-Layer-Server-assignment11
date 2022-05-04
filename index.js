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
      res.send("API is Running");
    });

    app.get("/product", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const product = await cursor.toArray();
      res.send(product);
    });

    // ========= Add API =======
    app.post("/add", async (req, res) => {
      const data = req.body;
      console.log(data);
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

    // ========= Update Product API =======
    app.get("/update/:rating", async (req, res) => {
      const newData = req.body;
      console.log(newData);
      const rating = req.params;
      const query = { rating: rating.rating };
      const options = { upsert: true };
      const result = await productCollection.updateOne(query, newData, options);
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
