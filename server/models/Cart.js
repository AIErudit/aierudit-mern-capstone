import mongoose from "mongoose";

const cartLineSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    // CAPSTONE-BUG-2 target: no integer / min: 1 validation here either; the controller bypass
    // sends negative or fractional values straight to Mongo.
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    lines: [cartLineSchema],
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);
