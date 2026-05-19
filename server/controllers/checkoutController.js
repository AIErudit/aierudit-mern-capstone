import { placeOrder } from "../services/checkoutService.js";

export async function placeOrderHandler(req, res, next) {
  try {
    const { cardNumber } = req.body;
    if (!cardNumber) {
      return res.status(400).json({ error: "missing_card_number" });
    }
    const order = await placeOrder({ userId: req.user._id, cardNumber });
    res.status(201).json(order);
  } catch (err) {
    if (err.code === "cart_empty") return res.status(400).json({ error: err.code });
    if (err.code === "out_of_stock") return res.status(409).json({ error: err.code, message: err.message });
    next(err);
  }
}
