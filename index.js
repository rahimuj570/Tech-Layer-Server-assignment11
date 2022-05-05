const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const { ObjectID } = require("bson");
require("dotenv").config();
const port = process.env.PORT || 5000;
const jwt = require("jsonwebtoken");
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

    // ========= Init API =======
    app.get("/", async (req, res) => {
      res.send("API is Running");
    });

    // ========= Show First 6 API =======
    app.get("/product/home", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query).limit(6);
      const product = await cursor.toArray();
      res.send(product);
    });

    // ========= Show API =======
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
      const result = await productCollection.insertOne(data);
      res.send({ result });
    });

    // ========= Specific User Product API =======
    app.get("/userProducts", async (req, res) => {
      const reqAuthorization = req.headers.authorization?.split(" ");
      if (reqAuthorization) {
        const uid = reqAuthorization?.[0];
        const email = reqAuthorization?.[1];
        const savedToken = reqAuthorization?.[2];
        const decode = verifyToken(savedToken);
        console.log(decode?.email);
        console.log(email);

        if (email === decode?.email?.email) {
          const query = { uid: uid };
          const cursor = await productCollection.find(query);
          const product = await cursor.toArray();
          res.send(product);
        } else {
          console.log("unaitor");
          res.send([{ status: "unAuthorization" }]);
        }
      }
    });

    // ========= Specific Product API =======
    app.get("/product/:id", async (req, res) => {
      const id = req.params;
      console.log(id);
      const query = { _id: ObjectID(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
    });

    // ========= Delete Product API =======
    app.delete("/delete/:id", async (req, res) => {
      const id = req.params;
      console.log(id);
      const query = { _id: ObjectID(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    });

    // ========= Generate JWT ========
    app.post("/login", async (req, res) => {
      const email = req.body;
      const token = jwt.sign({ email }, process.env.TOKEN);
      res.send({ token });
    });

    // ========= Update Product API =======
    app.put("/update/:id", async (req, res) => {
      const { name, quantity, price, image, supplier, info } = req.body;
      const newData = {
        $set: {
          name,
          quantity,
          price,
          image,
          supplier,
          info,
        },
      };
      const id = req.params;
      const query = { _id: ObjectID(id) };
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

// ========= Verify Token =========
function verifyToken(token) {
  let email;
  jwt.verify(token, process.env.TOKEN, function (err, decoded) {
    if (err) {
      email = "Unauthorized";
    }
    if (decoded) {
      email = decoded;
    }
  });
  return email;
}
