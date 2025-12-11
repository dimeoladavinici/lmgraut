function Logo({ onSecretClick }) {
    return (
        <button className="logo" onClick={onSecretClick}>
            <span className="logo-main">Autos</span>
            <span className="logo-sub">Usados</span>
        </button>
    );
}

export default Logo;
