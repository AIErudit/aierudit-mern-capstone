import { useListAdminOrdersQuery, useRefundOrderMutation } from "../store/api/adminApi.js";

export default function AdminPage() {
  const { data, isLoading, isError, error } = useListAdminOrdersQuery();
  const [refundOrder, { isLoading: refunding }] = useRefundOrderMutation();

  if (isLoading) return <p>Loading…</p>;
  if (isError) {
    if (error?.status === 403) {
      return <p className="error">Forbidden. Admin role required for this screen.</p>;
    }
    return <p className="error">Failed to load admin orders.</p>;
  }
  if (!data || data.items.length === 0) return <p className="notice">No orders yet.</p>;

  return (
    <section>
      <h1>Admin · orders</h1>
      <table className="table">
        <thead>
          <tr><th>Order</th><th>User</th><th>Placed</th><th>Total</th><th>Paid</th><th>Refunded</th><th></th></tr>
        </thead>
        <tbody>
          {data.items.map((o) => (
            <tr key={o._id}>
              <td><code>{o._id.slice(-8)}</code></td>
              <td>{o.user?.email || "—"}</td>
              <td>{new Date(o.createdAt).toLocaleString()}</td>
              <td>${(o.totalCents / 100).toFixed(2)}</td>
              <td>{o.isPaid ? "yes" : "no"}</td>
              <td>{o.isRefunded ? "yes" : "no"}</td>
              <td>
                <button
                  className="button button--ghost"
                  disabled={refunding || o.isRefunded}
                  onClick={() => refundOrder(o._id)}
                >
                  {o.isRefunded ? "—" : "Refund"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
