//entrypoint for database server
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("server ready");
});

app.post("/products", async (req, res) => {
  const product = req.body;
  if (!product.name || !product.price || !product.image) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }
  const newProduct = await Product.create(product);

  try {
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

console.log(process.env.MONGO_URI);

app.listen(5000, () => {
  connectDB();
  console.log("server started at http://localhost:5000");
});
