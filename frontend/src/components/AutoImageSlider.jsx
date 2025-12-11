import { useState, useEffect } from "react";

const BASE_URL = "https://lmgraut.onrender.com";

function AutoImageSlider({ fotos }) {
    const validFotos = fotos
        .filter((f) => !!f)
        .map((url) =>
            url.startsWith("http") ? url : `${BASE_URL}${url}`
        );

    const [index, setIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(null);

    useEffect(() => {
        if (validFotos.length <= 1) return;
        const id = setInterval(() => {
            setIndex((prev) => (prev + 1) % validFotos.length);
        }, 3000);
        return () => clearInterval(id);
    }, [validFotos.length]);

    if (validFotos.length === 0) {
        return <div className="slider-empty">Sin fotos</div>;
    }

    function next() {
        setIndex((prev) => (prev + 1) % validFotos.length);
    }

    function prev() {
        setIndex((prev) =>
            prev === 0 ? validFotos.length - 1 : prev - 1
        );
    }

    function handleTouchStart(e) {
        setTouchStart(e.touches[0].clientX);
    }

    function handleTouchEnd(e) {
        if (touchStart == null) return;
        const diff = e.changedTouches[0].clientX - touchStart;
        if (Math.abs(diff) > 40) {
            if (diff < 0) next();
            else prev();
        }
        setTouchStart(null);
    }

    return (
        <div
            className="slider"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <img
                src={validFotos[index]}
                alt="Vehículo"
                className="slider-img"
            />
            {validFotos.length > 1 && (
                <>
                    <button
                        type="button"
                        className="slider-arrow slider-arrow-left"
                        onClick={prev}
                    >
                        ‹
                    </button>
                    <button
                        type="button"
                        className="slider-arrow slider-arrow-right"
                        onClick={next}
                    >
                        ›
                    </button>
                    <div className="slider-dots">
                        {validFotos.map((_, i) => (
                            <span
                                key={i}
                                className={`dot ${i === index ? "active" : ""}`}
                                onClick={() => setIndex(i)}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default AutoImageSlider;
