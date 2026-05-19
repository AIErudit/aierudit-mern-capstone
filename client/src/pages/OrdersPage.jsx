import { useMyOrdersQuery } from "../store/api/ordersApi.js";

export default function OrdersPage() {
  const { data, isLoading } = useMyOrdersQuery();
  if (isLoading) return <p>Loading…</p>;
  if (!data || data.items.length === 0) return <p className="notice">No orders yet.</p>;

  return (
    <section>
      <h1>My orders</h1>
      <table className="table">
        <thead>
          <tr><th>Order</th><th>Placed</th><th>Total</th><th>Paid</th><th>Refunded</th></tr>
        </thead>
        <tbody>
          {data.items.map((o) => (
            <tr key={o._id}>
              <td><code>{o._id.slice(-8)}</code></td>
              <td>{new Date(o.createdAt).toLocaleString()}</td>
              <td>${(o.totalCents / 100).toFixed(2)}</td>
              <td>{o.isPaid ? "yes" : "no"}</td>
              <td>{o.isRefunded ? "yes" : "no"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
