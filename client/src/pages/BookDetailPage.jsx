import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useGetBookQuery } from "../store/api/booksApi.js";
import { useAddToCartMutation } from "../store/api/cartApi.js";
import { useMeQuery } from "../store/api/authApi.js";

export default function BookDetailPage() {
  const { id } = useParams();
  const { data: book, isLoading } = useGetBookQuery(id);
  const [quantity, setQuantity] = useState(1);
  const [addToCart, { isLoading: adding }] = useAddToCartMutation();
  const { data: me } = useMeQuery();
  const navigate = useNavigate();

  if (isLoading) return <p>Loading…</p>;
  if (!book) return <p>Book not found.</p>;

  async function onAdd() {
    if (!me) {
      navigate("/login");
      return;
    }
    await addToCart({ bookId: book._id, quantity: Number(quantity) });
    navigate("/cart");
  }

  return (
    <article style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 24 }}>
      <img className="card__cover" src={book.coverUrl} alt={book.title} />
      <div>
        <h1 style={{ marginTop: 0 }}>{book.title}</h1>
        <p className="card__author">{book.author}</p>
        <p>{book.description}</p>
        <p className="card__price">${(book.priceCents / 100).toFixed(2)}</p>
        <p className="notice">In stock: {book.stock}</p>
        <p className="notice">Rating: {book.ratingAvg ? book.ratingAvg.toFixed(1) : "—"} ({book.reviewsCount} reviews)</p>
        <label style={{ display: "inline-flex", flexDirection: "column", gap: 4, marginRight: 12 }}>
          Quantity
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={{ width: 80, padding: "6px 8px", border: "1px solid var(--color-border)", borderRadius: 6 }}
          />
        </label>
        <button className="button" onClick={onAdd} disabled={adding}>
          {adding ? "Adding…" : "Add to cart"}
        </button>
      </div>
    </article>
  );
}
