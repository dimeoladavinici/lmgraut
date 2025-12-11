import { useEffect, useState } from "react";
import { fetchAutos } from "../services/api";

const WHATSAPP_NUMERO = "5492396520000";
const API_BASE = "https://lmgraut.onrender.com";

export default function Home() {
    const [autos, setAutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [tipoFiltro, setTipoFiltro] = useState("todos");
    const [minAnio, setMinAnio] = useState("");
    const [slideIndex, setSlideIndex] = useState({});

    useEffect(() => {
        const cargar = async () => {
            try {
                setLoading(true);
                const data = await fetchAutos();
                setAutos(data || []);
            } catch (err) {
                console.error(err);
                setError("No pudimos cargar el catálogo. Probá de nuevo en unos minutos.");
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, []);

    const handleNext = (id, max) => {
        setSlideIndex((prev) => ({
            ...prev,
            [id]: prev[id] != null ? (prev[id] + 1) % max : 1 % max,
        }));
    };

    const handlePrev = (id, max) => {
        setSlideIndex((prev) => ({
            ...prev,
            [id]: prev[id] != null ? (prev[id] - 1 + max) % max : (max - 1 + max) % max,
        }));
    };

    const autosFiltrados = autos.filter((auto) => {
        const term = search.trim().toLowerCase();
        const coincideTexto =
            term === "" ||
            auto.nombre?.toLowerCase().includes(term) ||
            auto.descripcion?.toLowerCase().includes(term);

        const coincideTipo = tipoFiltro === "todos" || auto.tipo === tipoFiltro;

        const min = parseInt(minAnio, 10);
        const coincideAnio = !min || (auto.anio && Number(auto.anio) >= min);

        return coincideTexto && coincideTipo && coincideAnio;
    });

    const hayFiltrosActivos =
        search.trim() !== "" || tipoFiltro !== "todos" || minAnio !== "";

    const handleLimpiarFiltros = () => {
        setSearch("");
        setTipoFiltro("todos");
        setMinAnio("");
    };

    return (
        <div className="home">
            <div className="filters">
                <input
                    className="input"
                    placeholder="Buscar por modelo o marca"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className="select"
                    value={tipoFiltro}
                    onChange={(e) => setTipoFiltro(e.target.value)}
                >
                    <option value="todos">Todos</option>
                    <option value="auto">Autos</option>
                    <option value="moto">Motos</option>
                    <option value="otros">Otros</option>
                </select>
                <input
                    className="input"
                    placeholder="Año mínimo"
                    type="number"
                    value={minAnio}
                    onChange={(e) => setMinAnio(e.target.value)}
                />
            </div>

            <div className="home-results">
                {loading && <p>Cargando vehículos…</p>}
                {error && !loading && <p>{error}</p>}

                {!loading && !error && autosFiltrados.length === 0 && (
                    <div className="home-results-empty">
                        <p>No encontramos vehículos con esos filtros.</p>
                        {hayFiltrosActivos && (
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={handleLimpiarFiltros}
                            >
                                Ver todos los autos
                            </button>
                        )}
                    </div>
                )}

                {!loading && !error && autosFiltrados.length > 0 && (
                    <div className="grid-autos">
                        {autosFiltrados.map((auto) => {
                            const imagenes = [auto.foto1, auto.foto2, auto.foto3, auto.foto4]
                                .filter(Boolean)
                                .map((path) => `${API_BASE}${path}`);

                            const index = slideIndex[auto.id] ?? 0;
                            const actual = imagenes[index] || imagenes[0] || "";

                            /// >>> FIX KM SIN NaN <<<
                            const kmNumber = Number(auto.km);
                            const kmText = !Number.isNaN(kmNumber)
                                ? `${kmNumber.toLocaleString("es-AR")} km`
                                : "0 km";

                            const unico = auto.unicoDueno ? " (único dueño)" : "";
                            const vendido = !!auto.vendido;

                            const mensaje = `Hola, vi el ${auto.nombre || "vehículo"} en la web y quiero más info.`;
                            const urlWa = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(mensaje)}`;

                            return (
                                <article key={auto.id} className="auto-card-modern">
                                    <div className="slider">
                                        {vendido && <div className="sold-banner">Vendido</div>}

                                        {actual && (
                                            <img
                                                src={actual}
                                                alt={auto.nombre || "Vehículo"}
                                                className="slider-img"
                                                loading="lazy"
                                            />
                                        )}

                                        {imagenes.length > 1 && (
                                            <>
                                                <button
                                                    type="button"
                                                    className="slider-arrow slider-arrow-left"
                                                    onClick={() => handlePrev(auto.id, imagenes.length)}
                                                >
                                                    ‹
                                                </button>
                                                <button
                                                    type="button"
                                                    className="slider-arrow slider-arrow-right"
                                                    onClick={() => handleNext(auto.id, imagenes.length)}
                                                >
                                                    ›
                                                </button>

                                                <div className="slider-dots">
                                                    {imagenes.map((_, i) => (
                                                        <span
                                                            key={i}
                                                            className={"dot" + (i === index ? " active" : "")}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="auto-info">
                                        <h2 className="auto-name">{auto.nombre}</h2>

                                        <p className="auto-meta">
                                            {auto.anio || "Año"} · {kmText}
                                            {unico} · {auto.tipo}
                                        </p>

                                        <a
                                            href={vendido ? "#" : urlWa}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={`btn-wa ${vendido ? "btn-wa-disabled" : ""}`}
                                            onClick={(e) => vendido && e.preventDefault()}
                                        >
                                            {!vendido && (
                                                <img
                                                    src="/src/assets/whatsapp.svg"
                                                    alt="WhatsApp"
                                                    className="wa-icon-img"
                                                />
                                            )}
                                            <span>{vendido ? "Vendido" : "Consultar por WhatsApp"}</span>
                                        </a>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
