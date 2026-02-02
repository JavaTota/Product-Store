import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],

  setProducts: (products) => set({ products }),

  createProduct: async (newProduct) => {
    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.images ||
      newProduct.images.length === 0 ||
      !newProduct.description
    ) {
      return { success: false, message: "All fields are required" };
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      const data = await response.json();

      set((state) => ({
        products: [...state.products, data.data],
      }));

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Server error" };
    }
  },

  deleteProduct: async (productId) => {
    try {
      await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      set((state) => ({
        products: state.products.filter((product) => product._id !== productId),
      }));
    } catch (err) {
      console.error(err);
    }
  },

  updateProduct: async (updatedProduct) => {
    try {
      const response = await fetch(`/api/products/${updatedProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      const data = await response.json();

      set((state) => ({
        products: state.products.map((product) =>
          product._id === updatedProduct._id ? data.data : product,
        ),
      }));

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Update failed" };
    }
  },

  getProducts: async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      set({ products: data.data });
    } catch (err) {
      console.error(err);
    }
  },

  getProductById: async (productId) => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();
      return data.data;
    } catch (err) {
      console.error(err);
      return null;
    }
  },
}));
