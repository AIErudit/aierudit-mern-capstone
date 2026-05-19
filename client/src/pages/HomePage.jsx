import { Link } from "react-router-dom";
import { useState } from "react";
import { useListBooksQuery } from "../store/api/booksApi.js";

export default function HomePage() {
  const [q, setQ] = useState("");
  const { data, isLoading, isError } = useListBooksQuery({ q });

  return (
    <section>
      <h1>Catalog</h1>
      <input
        type="search"
        placeholder="Search by title or author"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ marginBottom: 16, padding: "8px 10px", width: 320, borderRadius: 6, border: "1px solid var(--color-border)" }}
      />
      {isLoading && <p>Loading…</p>}
      {isError && <p className="error">Failed to load books.</p>}
      {data && (
        <>
          <p className="notice">{data.total} books</p>
          <div className="grid">
            {data.items.map((book) => (
              <div key={book._id} className="card">
                <img className="card__cover" src={book.coverUrl} alt={book.title} />
                <div className="card__title">{book.title}</div>
                <div className="card__author">{book.author}</div>
                <div className="card__price">${(book.priceCents / 100).toFixed(2)}</div>
                <Link to={`/books/${book._id}`} className="button button--ghost">Details</Link>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
