import { create } from "zustand";

export const useCategoryStore = create((set) => ({
  categories: [],

  setCategories: (categories) => set({ categories }),

  getCategories: async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      set({ categories: data });
    } catch (err) {
      console.error(err);
    }
  },

  createCategory: async (name) => {
    if (!name) {
      return { success: false, message: "Category name is required" };
    }

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      set((state) => ({
        categories: [...state.categories, data],
      }));

      return { success: true, category: data };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Server error" };
    }
  },

  deleteCategory: async (categoryId) => {
    try {
      await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      set((state) => ({
        categories: state.categories.filter(
          (category) => category._id !== categoryId,
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  },
}));
