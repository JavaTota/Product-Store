import { create } from "zustand";

export const useParsedPrice = create(() => ({
  parsePrice: (value) => {
    if (typeof value !== "string") return null;
    if (!value) return null;

    // Remove spaces
    let cleaned = value.trim();

    // Convert EU format → US format
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");

    const number = Number(cleaned);

    return isNaN(number) ? null : number;
  },
}));
