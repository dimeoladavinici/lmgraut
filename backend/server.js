import express from "express";
import cors from "cors";
import autosRoutes from "./routes/autos.js";
import uploadRoutes from "./routes/upload.js";

const app = express();

app.use(cors());
app.use(express.json());

// servir imágenes
app.use("/uploads", express.static("uploads"));

app.use("/api/autos", autosRoutes);
app.use("/api/upload", uploadRoutes);

const PORT = 4000;
app.listen(PORT, () => {
    console.log("Servidor backend corriendo en puerto " + PORT);
});
