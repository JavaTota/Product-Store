//entrypoint for database server
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import productsRoutes from "./routes/products.routes.js";

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("server ready");
});

app.use(express.json()); // add middleware to parse JSON request bodies

app.use("/api/products", productsRoutes);

console.log(process.env.MONGO_URI);

app.listen(5000, () => {
  connectDB();
  console.log("server started at http://localhost:5000");
});
