import express from "express";
import {
  createCategory,
  getCategories,
} from "../controllers/category.controller.js";

const router = express.Router();

// GET all categories
router.get("/", getCategories);

// CREATE category
router.post("/", createCategory);

export default router;
