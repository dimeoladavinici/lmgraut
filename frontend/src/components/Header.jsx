import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Logo from "./Logo.jsx";

function Header() {
    const [clicks, setClicks] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    function handleLogoClick() {
        const next = clicks + 1;
        if (next >= 5) {
            navigate("/admin");
            setClicks(0);
        } else {
            setClicks(next);
        }
    }

    return (
        <header className="header">
            <div className="header-inner">
                <Logo onSecretClick={handleLogoClick} />
                <nav className="nav">
                    <Link
                        to="/"
                        className={location.pathname === "/" ? "nav-link active" : "nav-link"}
                    >
                        Catálogo
                    </Link>
                    <Link
                        to="/tasacion"
                        className={
                            location.pathname === "/tasacion" ? "nav-link active" : "nav-link"
                        }
                    >
                        Tasamos tu auto
                    </Link>
                </nav>
            </div>
        </header>
    );
}

export default Header;
