import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    titleSnapshot: { type: String, required: true },
    priceCents: { type: Number, required: true },
    // CAPSTONE-BUG-2 target: validated only weakly; cartController.addItem persists negative/float
    // values into the user's cart, which feed into this orderItem at checkout time.
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: [orderItemSchema],
    totalCents: { type: Number, required: true },
    paymentMethod: { type: String, required: true, default: "mock-card" },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    paymentRef: { type: String },
    isRefunded: { type: Boolean, default: false },
    refundedAt: { type: Date },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
