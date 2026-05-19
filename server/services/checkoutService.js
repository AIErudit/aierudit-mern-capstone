import { Book } from "../models/Book.js";
import { Cart } from "../models/Cart.js";
import { Order } from "../models/Order.js";
import { processPayment } from "./paymentService.js";

/**
 * Convert the user's current cart into an order, charge the payment provider,
 * and decrement stock. Returns the persisted Order document.
 *
 * Used by checkoutController.placeOrder.
 */
export async function placeOrder({ userId, cardNumber }) {
  const cart = await Cart.findOne({ user: userId }).populate("lines.book");
  if (!cart || cart.lines.length === 0) {
    const err = new Error("Cart is empty.");
    err.code = "cart_empty";
    throw err;
  }

  // Build order item snapshots and the total.
  const items = [];
  let totalCents = 0;
  for (const line of cart.lines) {
    const book = line.book;
    if (!book) continue;
    items.push({
      book: book._id,
      titleSnapshot: book.title,
      priceCents: book.priceCents,
      quantity: line.quantity,
    });
    totalCents += book.priceCents * line.quantity;
  }

  // CAPSTONE-BUG-1: this stock check + stock write is non-atomic.
  // We read book.stock from the populated document, compare against the
  // line quantity in JS, then write the decremented stock back. Two concurrent
  // place-order calls for the same book with stock=1 both pass the check and
  // both write stock=0 (or worse, stock=-1). Expected fix: replace this loop
  // with a Mongoose findOneAndUpdate using a conditional $inc, e.g.
  //   Book.findOneAndUpdate(
  //     { _id: bookId, stock: { $gte: requestedQty } },
  //     { $inc: { stock: -requestedQty } },
  //     { new: true }
  //   )
  // If the result is null, reject with a 409 "out of stock" before charging.
  for (const line of cart.lines) {
    const book = line.book;
    if (book.stock < line.quantity) {
      const err = new Error(`Insufficient stock for "${book.title}".`);
      err.code = "out_of_stock";
      throw err;
    }
  }
  for (const line of cart.lines) {
    const book = line.book;
    book.stock -= line.quantity;
    await book.save();
  }

  // Charge through the payment mock. See CAPSTONE-BUG-4 — this currently
  // always reports success.
  const payment = await processPayment({ cardNumber, amountCents: totalCents });

  const order = await Order.create({
    user: userId,
    items,
    totalCents,
    paymentMethod: "mock-card",
    isPaid: !!payment.success,
    paidAt: payment.success ? new Date() : undefined,
    paymentRef: payment.providerRef,
  });

  // Clear the cart on success.
  cart.lines = [];
  await cart.save();

  return order;
}

export async function refundOrder({ orderId }) {
  const order = await Order.findById(orderId);
  if (!order) {
    const err = new Error("Order not found.");
    err.code = "not_found";
    throw err;
  }
  if (order.isRefunded) {
    return order;
  }
  order.isRefunded = true;
  order.refundedAt = new Date();
  await order.save();
  return order;
}
