const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

// ======= Middledware =====
app.use(cors());
app.use(express.json());

// ========= API ========
app.get("/", (req, res) => {
  console.log("object");
  res.send("Server is running");
});

// ===== Listining Port ======
app.listen(port, () => {
  console.log("Port is Running", port);
});
