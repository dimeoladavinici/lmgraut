import { initDB } from "./models/Auto.js";

initDB()
    .then(() => {
        console.log("Base de datos inicializada");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Error al inicializar la base de datos", err);
        process.exit(1);
    });
