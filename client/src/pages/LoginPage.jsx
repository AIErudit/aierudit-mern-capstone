import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLoginMutation } from "../store/api/authApi.js";

export default function LoginPage() {
  const [email, setEmail] = useState("john@learner.aierudit.io");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login({ email, password }).unwrap();
      navigate("/");
    } catch (err) {
      setError(err?.data?.error || "login_failed");
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <h1>Log in</h1>
      <label>Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>Password
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      {error && <p className="error">{error}</p>}
      <button className="button" disabled={isLoading}>{isLoading ? "Signing in…" : "Sign in"}</button>
      <p className="notice">No account? <Link to="/register">Sign up</Link></p>
      <p className="notice">Seed user: john@learner.aierudit.io / 123456</p>
    </form>
  );
}
