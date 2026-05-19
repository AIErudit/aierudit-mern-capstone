import { Link } from "react-router-dom";
import { useGetCartQuery, useRemoveFromCartMutation } from "../store/api/cartApi.js";

export default function CartPage() {
  const { data: cart, isLoading } = useGetCartQuery();
  const [removeFromCart] = useRemoveFromCartMutation();

  if (isLoading) return <p>Loading…</p>;
  if (!cart || cart.lines.length === 0) {
    return (
      <section>
        <h1>Cart</h1>
        <p className="notice">Your cart is empty. <Link to="/">Browse the catalog</Link>.</p>
      </section>
    );
  }

  const total = cart.lines.reduce((sum, line) => sum + (line.book?.priceCents || 0) * line.quantity, 0);

  return (
    <section>
      <h1>Cart</h1>
      <table className="table">
        <thead>
          <tr><th>Title</th><th>Qty</th><th>Price</th><th></th></tr>
        </thead>
        <tbody>
          {cart.lines.map((line) => (
            <tr key={String(line.book?._id)}>
              <td>{line.book?.title || "—"}</td>
              <td>{line.quantity}</td>
              <td>${((line.book?.priceCents || 0) * line.quantity / 100).toFixed(2)}</td>
              <td>
                <button className="button button--ghost" onClick={() => removeFromCart(line.book?._id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr><td colSpan={2}><strong>Total</strong></td><td colSpan={2}><strong>${(total / 100).toFixed(2)}</strong></td></tr>
        </tfoot>
      </table>
      <p><Link className="button" to="/checkout">Checkout</Link></p>
    </section>
  );
}
