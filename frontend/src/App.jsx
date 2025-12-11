import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Tasacion from "./pages/Tasacion.jsx";
import Admin from "./pages/Admin.jsx";
import WhatsAppFloat from "./components/WhatsAppFloat.jsx";
import logo from "./assets/logo.png";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-inner">
        <button className="logo" onClick={handleLogoClick}>
          <img
            src={logo}
            alt="Lucas Automotores"
            style={{
              height: "40px",
              width: "auto",
              display: "block",
            }}
          />
        </button>
        <nav className="nav">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""
              }`}
          >
            Catálogo
          </Link>
          <Link
            to="/tasacion"
            className={`nav-link ${location.pathname === "/tasacion" ? "active" : ""
              }`}
          >
            Tasamos tu auto
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  const navigate = useNavigate();

  const handleAdminAccess = () => {
    navigate("/admin");
  };

  return (
    <footer
      style={{
        padding: "1rem",
        textAlign: "center",
        fontSize: "0.8rem",
        color: "#6b7280",
        borderTop: "1px solid #e5e7eb",
        marginTop: "auto",
      }}
    >
      <div>
        Desarrollado por{" "}
        <a
          href="https://instagram.com/juanpedimeola"
          target="_blank"
          rel="noreferrer"
          style={{ color: "#111827", textDecoration: "none", fontWeight: 600 }}
        >
          @juanpedimeola
        </a>
      </div>
      <button
        onClick={handleAdminAccess}
        style={{
          marginTop: "0.35rem",
          background: "none",
          border: "none",
          fontSize: "0.7rem",
          color: "#9ca3af",
          cursor: "pointer",
          textDecoration: "underline",
        }}
      >
        Admin
      </button>
    </footer>
  );
}


function App() {
  return (
    <div className="app-root">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tasacion" element={<Tasacion />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

export default App;
