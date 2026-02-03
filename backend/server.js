//entrypoint for database server
import dotenv from "dotenv";
dotenv.config(); //load environment variables

import express from "express";
import { connectDB } from "./config/db.js";

import uploadRoutes from "./routes/upload.routes.js";
import productsRoutes from "./routes/products.routes.js";
import categoryRoutes from "./routes/category.routes.js";

const app = express(); //create express app
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("server ready");
}); //test route

app.use(express.json({ limit: "10mb" })); // add middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/products", productsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/categories", categoryRoutes);

console.log(process.env.MONGO_URI);

app.listen(PORT, () => {
  connectDB();
  console.log(`server started at http://localhost:${PORT}`);
}); //start server and connect to database
