import { useState } from "react";

function Tasacion() {
    const [form, setForm] = useState({
        nombre: "",
        ciudad: "",
        marca: "",
        modelo: "",
        anio: "",
        km: "",
        estado: "",
        detalles: ""
    });

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        const message = encodeURIComponent(
            `Hola, me gustaría tasar mi auto:\n\nNombre: ${form.nombre}\nCiudad: ${form.ciudad}\nAuto: ${form.marca} ${form.modelo}\nAño: ${form.anio}\nKm: ${form.km}\nEstado general: ${form.estado}\nDetalles adicionales: ${form.detalles}`
        );
        const url = `https://wa.me/5492396442868?text=${message}`;
        window.open(url, "_blank");
    }

    return (
        <section className="tasacion">
            <h1 className="section-title">Tasamos tu auto</h1>
            <p className="section-subtitle">
                Completá estos datos y te respondemos por WhatsApp con una tasación
                aproximada.
            </p>
            <form className="form" onSubmit={handleSubmit}>
                <input
                    className="input"
                    name="nombre"
                    placeholder="Nombre y apellido"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                />
                <input
                    className="input"
                    name="ciudad"
                    placeholder="Ciudad"
                    value={form.ciudad}
                    onChange={handleChange}
                    required
                />
                <input
                    className="input"
                    name="marca"
                    placeholder="Marca"
                    value={form.marca}
                    onChange={handleChange}
                    required
                />
                <input
                    className="input"
                    name="modelo"
                    placeholder="Modelo"
                    value={form.modelo}
                    onChange={handleChange}
                    required
                />
                <input
                    className="input"
                    type="number"
                    name="anio"
                    placeholder="Año"
                    value={form.anio}
                    onChange={handleChange}
                    required
                />
                <input
                    className="input"
                    name="km"
                    placeholder="Kilometraje aproximado"
                    value={form.km}
                    onChange={handleChange}
                    required
                />
                <select
                    className="select"
                    name="estado"
                    value={form.estado}
                    onChange={handleChange}
                    required
                >
                    <option value="">Estado general</option>
                    <option value="Excelente">Excelente</option>
                    <option value="Muy bueno">Muy bueno</option>
                    <option value="Bueno">Bueno</option>
                    <option value="Regular">Regular</option>
                </select>
                <textarea
                    className="textarea"
                    name="detalles"
                    placeholder="Detalles adicionales (equipamiento, choques, etc.)"
                    value={form.detalles}
                    onChange={handleChange}
                />
                <button className="btn btn-primary" type="submit">
                    Enviar por WhatsApp
                </button>
            </form>
        </section>
    );
}

export default Tasacion;
