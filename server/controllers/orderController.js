import { Order } from "../models/Order.js";

export async function myOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json({ items: orders });
  } catch (err) {
    next(err);
  }
}

export async function getOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ error: "not_found" });
    if (String(order.user) !== String(req.user._id) && !req.user.isAdmin) {
      return res.status(403).json({ error: "forbidden" });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
}
