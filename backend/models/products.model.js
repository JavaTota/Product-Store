// creating product collection(called model) in database
import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, //createdAt, updatedAt
  }
);

export const Product = mongoose.model("Product", productSchema);

export default Product;
