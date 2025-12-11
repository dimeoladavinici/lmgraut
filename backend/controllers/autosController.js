import { openDB } from "../models/Auto.js";

export const getAutos = async (req, res) => {
    const db = await openDB();
    const autos = await db.all("SELECT * FROM autos ORDER BY id DESC");
    res.json(autos);
};

export const createAuto = async (req, res) => {
    const {
        estado,
        tipo,
        nombre,
        anio,
        km,
        vendido,
        foto1,
        foto2,
        foto3,
        foto4
    } = req.body;

    const db = await openDB();

    await db.run(
        `INSERT INTO autos (estado, tipo, nombre, anio, km, vendido, foto1, foto2, foto3, foto4)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            estado,
            tipo || "auto",
            nombre,
            anio,
            km,
            vendido ? 1 : 0,
            foto1 || "",
            foto2 || "",
            foto3 || "",
            foto4 || ""
        ]
    );

    res.json({ message: "Auto creado" });
};

export const deleteAuto = async (req, res) => {
    const { id } = req.params;
    const db = await openDB();

    await db.run("DELETE FROM autos WHERE id = ?", [id]);
    res.json({ message: "Auto eliminado" });
};

export const updateAuto = async (req, res) => {
    const { id } = req.params;
    const {
        estado,
        tipo,
        nombre,
        anio,
        km,
        vendido,
        foto1,
        foto2,
        foto3,
        foto4
    } = req.body;

    const db = await openDB();

    await db.run(
        `UPDATE autos
     SET estado = ?, tipo = ?, nombre = ?, anio = ?, km = ?, vendido = ?, foto1 = ?, foto2 = ?, foto3 = ?, foto4 = ?
     WHERE id = ?`,
        [
            estado,
            tipo || "auto",
            nombre,
            anio,
            km,
            vendido ? 1 : 0,
            foto1 || "",
            foto2 || "",
            foto3 || "",
            foto4 || "",
            id
        ]
    );

    res.json({ message: "Auto actualizado" });
};
