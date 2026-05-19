import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegisterMutation } from "../store/api/authApi.js";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await register({ name, email, password }).unwrap();
      navigate("/");
    } catch (err) {
      setError(err?.data?.error || "register_failed");
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <h1>Sign up</h1>
      <label>Name
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>Password
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
      </label>
      {error && <p className="error">{error}</p>}
      <button className="button" disabled={isLoading}>{isLoading ? "Creating…" : "Create account"}</button>
      <p className="notice">Already have one? <Link to="/login">Log in</Link></p>
    </form>
  );
}
