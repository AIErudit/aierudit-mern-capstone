import { refundOrder } from "../services/checkoutService.js";
import { Order } from "../models/Order.js";

export async function listOrders(_req, res, next) {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .limit(100)
      .lean();
    res.json({ items: orders });
  } catch (err) {
    next(err);
  }
}

export async function refund(req, res, next) {
  try {
    const order = await refundOrder({ orderId: req.params.id });
    res.json(order);
  } catch (err) {
    if (err.code === "not_found") return res.status(404).json({ error: "not_found" });
    next(err);
  }
}
