import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    priceCents: { type: Number, required: true, min: 0 },
    coverUrl: { type: String, default: "" },
    isbn: { type: String, default: "" },
    // CAPSTONE-BUG-1 target: this field is read non-atomically by checkoutService.placeOrder.
    stock: { type: Number, required: true, default: 0, min: 0 },
    category: { type: String, default: "general" },
  },
  { timestamps: true }
);

bookSchema.index({ title: "text", author: "text", category: 1 });

export const Book = mongoose.model("Book", bookSchema);
