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

    // ========= API =======
    app.get("/", async (req, res) => {
      const q = {};
      const cursor = productCollection.find(q);
      const product = await cursor.toArray();
      res.send(product);
    });
  } finally {
    //
  }
}
run();

// ========== Listening =======
app.listen(port, () => {
  console.log("Listening to port", port);
});
