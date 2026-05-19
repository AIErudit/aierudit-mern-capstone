import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useMeQuery, useLogoutMutation } from "../store/api/authApi.js";

function Header() {
  const { data: me } = useMeQuery();
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  async function onLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="header">
      <div className="container header__bar">
        <NavLink to="/" className="header__brand">AIErudit Bookshop</NavLink>
        <nav className="header__nav">
          <NavLink to="/">Catalog</NavLink>
          {me ? (
            <>
              <NavLink to="/cart">Cart</NavLink>
              <NavLink to="/orders">My orders</NavLink>
              {me.isAdmin && <NavLink to="/admin">Admin</NavLink>}
              <span className="notice">{me.email}</span>
              <button className="button button--ghost" onClick={onLogout}>Log out</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Log in</NavLink>
              <NavLink to="/register">Sign up</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      AIErudit Bookshop — capstone starter. Bugs are intentional.
    </footer>
  );
}

export default function Layout() {
  return (
    <>
      <Header />
      <main className="main">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
}
