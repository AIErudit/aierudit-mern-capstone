import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlaceOrderMutation } from "../store/api/checkoutApi.js";

export default function CheckoutPage() {
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [error, setError] = useState("");
  const [placeOrder, { isLoading }] = usePlaceOrderMutation();
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const order = await placeOrder({ cardNumber }).unwrap();
      navigate(`/orders`);
    } catch (err) {
      setError(err?.data?.message || err?.data?.error || "checkout_failed");
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <h1>Checkout</h1>
      <p className="notice">
        Mock payment provider. Try card numbers:<br />
        4242 4242 4242 4242 — accepted<br />
        4000 0000 0000 0002 — declined by issuer<br />
        4000 0000 0000 0119 — provider timeout
      </p>
      <label>Card number
        <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />
      </label>
      {error && <p className="error">{error}</p>}
      <button className="button" disabled={isLoading}>{isLoading ? "Charging…" : "Place order"}</button>
    </form>
  );
}
