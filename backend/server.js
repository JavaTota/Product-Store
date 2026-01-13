//entrypoint for database server
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import productsRoutes from "./routes/products.routes.js";

dotenv.config(); //load environment variables

const app = express(); //create express app
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("server ready");
}); //test route

app.use(express.json()); // add middleware to parse JSON request bodies

app.use("/api/products", productsRoutes);

console.log(process.env.MONGO_URI);

app.listen(PORT, () => {
  connectDB();
  console.log(`server started at http://localhost:${PORT}`);
}); //start server and connect to database
