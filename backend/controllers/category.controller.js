import Category from "../models/category.model.js";
import slugify from "slugify";

export const getCategories = async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort("name");
  res.json(categories);
};

export const createCategory = async (req, res) => {
  const { name } = req.body;

  const category = await Category.create({
    name,
    slug: slugify(name),
  });

  res.status(201).json(category);
};
