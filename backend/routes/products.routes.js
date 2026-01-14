import express from "express";

import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/products.controller.js";

const router = express.Router();

router.get("", getProducts);

router.post("/", createProduct);

router.delete("/:id", deleteProduct);

router.put("/:id", updateProduct);

export default router;
