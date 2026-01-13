import express from "express";

import {
  getProducts,
  createProducts,
  deleteProduct,
  updateProduct,
} from "../controllers/products.controller.js";

const router = express.Router();

router.get("", getProducts);

router.post("/", createProducts);

router.delete("/:id", deleteProduct);

router.put("/:id", updateProduct);

export default router;
