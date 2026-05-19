import { Cart } from "../models/Cart.js";
import { Book } from "../models/Book.js";

export async function getCart(req, res, next) {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("lines.book");
    res.json(cart || { user: req.user._id, lines: [] });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/cart/items
 * body: { bookId, quantity }
 *
 * CAPSTONE-BUG-2: this handler reads req.body.quantity and persists it
 * without validating it as a positive integer.
 * - Negative quantities are accepted and reduce existing cart lines.
 * - Floats are accepted (e.g., quantity: 1.5 stores a fractional value).
 * - Non-numeric strings are coerced silently by Mongoose's type cast
 *   (which can land as NaN in some edge cases).
 *
 * Expected fix: validate at the controller boundary
 *   if (!Number.isInteger(quantity) || quantity < 1 || quantity > 999) {
 *     return res.status(400).json({ error: "bad_quantity" });
 *   }
 * AND add schema-level constraints on the Cart line and Order item
 * quantity fields.
 */
export async function addItem(req, res, next) {
  try {
    const { bookId, quantity } = req.body;
    if (!bookId) {
      return res.status(400).json({ error: "missing_book_id" });
    }
    const book = await Book.findById(bookId).lean();
    if (!book) {
      return res.status(404).json({ error: "book_not_found" });
    }

    // CAPSTONE-BUG-2 site: no validation of `quantity` happens here.
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, lines: [] });
    }
    const existing = cart.lines.find((l) => String(l.book) === String(bookId));
    if (existing) {
      existing.quantity = existing.quantity + quantity;
    } else {
      cart.lines.push({ book: bookId, quantity });
    }
    await cart.save();

    const refreshed = await Cart.findById(cart._id).populate("lines.book");
    res.status(201).json(refreshed);
  } catch (err) {
    next(err);
  }
}

export async function removeItem(req, res, next) {
  try {
    const { bookId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.json({ user: req.user._id, lines: [] });
    cart.lines = cart.lines.filter((l) => String(l.book) !== String(bookId));
    await cart.save();
    const refreshed = await Cart.findById(cart._id).populate("lines.book");
    res.json(refreshed);
  } catch (err) {
    next(err);
  }
}
