import { useEffect, useState } from "react"
import waIcon from "../assets/whatsapp.svg"

const API_BASE = "http://localhost:4000"

export default function AutoCard({ auto }) {
    const [index, setIndex] = useState(0)

    const fotos = [auto.foto1, auto.foto2, auto.foto3, auto.foto4]
        .filter(Boolean)
        .map((f) => (f.startsWith("http") ? f : `${API_BASE}${f}`))

    // km seguro, sin NaN
    const kmNumber = parseInt(auto.km, 10)
    const kmTexto = Number.isNaN(kmNumber)
        ? auto.km
        : kmNumber.toLocaleString("es-AR")

    const isSold = auto.vendido === 1 || auto.estado === "VENDIDO"

    useEffect(() => {
        if (fotos.length <= 1) return
        const id = setInterval(
            () => setIndex((i) => (i + 1) % fotos.length),
            3500
        )
        return () => clearInterval(id)
    }, [fotos.length])

    const handleClick = () => {
        if (isSold) return

        const telefono = import.meta.env.VITE_TELEFONO_WA || "5492396442868"
        const texto = `Hola, vi el ${auto.nombre} (${auto.anio} - ${kmTexto} km${auto.unico_dueno ? " - único dueño" : ""
            }) en la web. ¿Sigue disponible?`

        const url = `https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`
        window.open(url, "_blank")
    }

    return (
        <article className="auto-card-modern">
            <div className="slider">
                {isSold && <div className="sold-banner">VENDIDO</div>}

                {fotos.length > 0 && (
                    <>
                        <img
                            src={fotos[index]}
                            alt={auto.nombre}
                            className="slider-img"
                        />

                        {fotos.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    className="slider-arrow slider-arrow-left"
                                    onClick={() =>
                                        setIndex((i) => (i - 1 + fotos.length) % fotos.length)
                                    }
                                >
                                    ‹
                                </button>
                                <button
                                    type="button"
                                    className="slider-arrow slider-arrow-right"
                                    onClick={() =>
                                        setIndex((i) => (i + 1) % fotos.length)
                                    }
                                >
                                    ›
                                </button>
                                <div className="slider-dots">
                                    {fotos.map((_, i) => (
                                        <span
                                            key={i}
                                            className={`dot ${i === index ? "active" : ""}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>

            <div className="auto-info">
                <h3 className="auto-name">{auto.nombre}</h3>
                <p className="auto-meta">
                    📅 {auto.anio} · 🛞 {kmTexto} km
                    {auto.unico_dueno ? " (único dueño)" : ""} · {auto.tipo}
                </p>

                <button
                    type="button"
                    onClick={handleClick}
                    disabled={isSold}
                    className={`btn-wa ${isSold ? "btn-wa-disabled" : ""}`}
                >
                    <img src={waIcon} alt="" className="wa-icon-img" />
                    {isSold ? "Vehículo vendido" : "Consultar por este vehículo"}
                </button>
            </div>
        </article>
    )
}
