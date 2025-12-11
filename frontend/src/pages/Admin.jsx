import { useEffect, useState } from "react";
import {
    fetchAutos,
    createAuto,
    deleteAuto,
    updateAuto,
    uploadFoto
} from "../services/api.js";

const ADMIN_PASSWORD = "lucasmolina";

function Admin() {
    const [logged, setLogged] = useState(false);
    const [password, setPassword] = useState("");

    const [autos, setAutos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        estado: "EN STOCK",
        tipo: "auto",
        nombre: "",
        anio: "",
        km: "",
        duenoUnico: 0,
        foto1: "",
        foto2: "",
        foto3: "",
        foto4: ""
    });

    const [uploadStatus, setUploadStatus] = useState({
        foto1: "",
        foto2: "",
        foto3: "",
        foto4: ""
    });

    const [search, setSearch] = useState("");

    useEffect(() => {
        if (logged) {
            loadAutos();
        }
    }, [logged]);

    async function loadAutos() {
        setLoading(true);
        try {
            const data = await fetchAutos();
            setAutos(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    function handleLogin(e) {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setLogged(true);
        } else {
            alert("Contraseña incorrecta");
        }
    }

    function handleChange(e) {
        const { name, type, checked, value } = e.target;
        let val = value;
        if (name === "duenoUnico") {
            val = checked ? 1 : 0;
        }
        setForm({ ...form, [name]: val });
    }

    async function handleFileChange(field, e) {
        const file = e.target.files[0];
        if (!file) return;

        if (
            file.type.includes("heic") ||
            file.name.toLowerCase().endsWith(".heic")
        ) {
            alert(
                "Este formato HEIC no se puede procesar. Convertí la foto a JPG o PNG antes de subirla."
            );
            return;
        }

        setUploadStatus((prev) => ({ ...prev, [field]: "subiendo..." }));
        try {
            const data = await uploadFoto(file);
            setForm((prev) => ({ ...prev, [field]: data.url }));
            setUploadStatus((prev) => ({ ...prev, [field]: "✔ Subida" }));
        } catch (err) {
            console.error(err);
            setUploadStatus((prev) => ({ ...prev, [field]: "Error" }));
            alert("Error al subir la imagen");
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!form.nombre || !form.anio || !form.km) {
            alert("Completá nombre, año y km");
            return;
        }

        if (!form.foto1) {
            alert("Subí al menos la foto 1");
            return;
        }

        const kmFinal =
            form.duenoUnico === 1
                ? `${form.km} (único dueño)`
                : form.km;

        const vendidoFlag = form.estado === "VENDIDO" ? 1 : 0;

        const payload = {
            estado: form.estado,
            tipo: form.tipo,
            nombre: form.nombre,
            anio: form.anio,
            km: kmFinal,
            vendido: vendidoFlag,
            foto1: form.foto1,
            foto2: form.foto2,
            foto3: form.foto3,
            foto4: form.foto4
        };

        if (editingId) {
            await updateAuto(editingId, payload);
        } else {
            await createAuto(payload);
        }

        setForm({
            estado: "EN STOCK",
            tipo: "auto",
            nombre: "",
            anio: "",
            km: "",
            duenoUnico: 0,
            foto1: "",
            foto2: "",
            foto3: "",
            foto4: ""
        });
        setUploadStatus({
            foto1: "",
            foto2: "",
            foto3: "",
            foto4: ""
        });
        setEditingId(null);
        loadAutos();
    }

    function handleEdit(auto) {
        setEditingId(auto.id);
        setForm({
            estado: auto.estado || "EN STOCK",
            tipo: auto.tipo || "auto",
            nombre: auto.nombre,
            anio: auto.anio,
            km: auto.km.replace(" (único dueño)", ""),
            duenoUnico: auto.km.includes("único dueño") ? 1 : 0,
            foto1: auto.foto1 || "",
            foto2: auto.foto2 || "",
            foto3: auto.foto3 || "",
            foto4: auto.foto4 || ""
        });
        setUploadStatus({
            foto1: auto.foto1 ? "✔ Subida" : "",
            foto2: auto.foto2 ? "✔ Subida" : "",
            foto3: auto.foto3 ? "✔ Subida" : "",
            foto4: auto.foto4 ? "✔ Subida" : ""
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleDelete(id) {
        const ok = window.confirm("¿Eliminar este vehículo?");
        if (!ok) return;
        await deleteAuto(id);
        loadAutos();
    }

    if (!logged) {
        return (
            <section className="admin-login">
                <h1 className="section-title">Zona privada</h1>
                <form className="form" onSubmit={handleLogin}>
                    <input
                        type="password"
                        className="input"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="btn btn-primary" type="submit">
                        Entrar
                    </button>
                </form>
            </section>
        );
    }

    const filteredAutos = autos.filter((a) =>
        `${a.nombre} ${a.anio} ${a.estado} ${a.tipo || ""}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <section className="admin">
            <h1 className="section-title">Administrar vehículos</h1>

            <div className="admin-form-card">
                <form className="form" onSubmit={handleSubmit}>
                    <select
                        className="select"
                        name="estado"
                        value={form.estado}
                        onChange={handleChange}
                    >
                        <option value="EN STOCK">En stock</option>
                        <option value="VENDIDO">Vendido</option>
                    </select>

                    <select
                        className="select"
                        name="tipo"
                        value={form.tipo}
                        onChange={handleChange}
                    >
                        <option value="auto">Auto</option>
                        <option value="moto">Moto</option>
                        <option value="otro">Otros</option>
                    </select>

                    <input
                        className="input"
                        name="nombre"
                        placeholder="Nombre del vehículo"
                        value={form.nombre}
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
                        placeholder="KM (ej: 44.000)"
                        value={form.km}
                        onChange={handleChange}
                        required
                    />

                    <label className="checkbox-row">
                        <input
                            type="checkbox"
                            name="duenoUnico"
                            checked={form.duenoUnico === 1}
                            onChange={handleChange}
                        />
                        <span>Único dueño</span>
                    </label>

                    <div className="upload-group">
                        <label className="upload-label">
                            Foto 1 (obligatoria)
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange("foto1", e)}
                            />
                            <span className="upload-status">
                                {uploadStatus.foto1}
                            </span>
                        </label>

                        <label className="upload-label">
                            Foto 2 (opcional)
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange("foto2", e)}
                            />
                            <span className="upload-status">
                                {uploadStatus.foto2}
                            </span>
                        </label>

                        <label className="upload-label">
                            Foto 3 (opcional)
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange("foto3", e)}
                            />
                            <span className="upload-status">
                                {uploadStatus.foto3}
                            </span>
                        </label>

                        <label className="upload-label">
                            Foto 4 (opcional)
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange("foto4", e)}
                            />
                            <span className="upload-status">
                                {uploadStatus.foto4}
                            </span>
                        </label>
                    </div>

                    <button className="btn btn-primary" type="submit">
                        {editingId ? "Guardar cambios" : "Agregar vehículo"}
                    </button>
                </form>
            </div>

            <div className="admin-list-wrapper">
                <input
                    className="input admin-search"
                    placeholder="Buscar por nombre, año, estado o tipo..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {loading ? (
                    <p className="status-text">Cargando...</p>
                ) : filteredAutos.length === 0 ? (
                    <p className="status-text">No hay vehículos cargados.</p>
                ) : (
                    <div className="admin-list">
                        {filteredAutos.map((auto) => (
                            <div key={auto.id} className="admin-card">
                                <div className="admin-card-main">
                                    <p className="admin-card-title">{auto.nombre}</p>
                                    <p className="admin-card-meta">
                                        {auto.anio} · {auto.km}
                                    </p>
                                    <p className="admin-card-meta">
                                        {(auto.tipo || "auto").toUpperCase()} ·{" "}
                                        {auto.estado}
                                    </p>
                                </div>
                                <div className="admin-card-actions">
                                    <button
                                        type="button"
                                        className="btn btn-small"
                                        onClick={() => handleEdit(auto)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-small btn-danger"
                                        onClick={() => handleDelete(auto.id)}
                                    >
                                        Borrar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default Admin;
