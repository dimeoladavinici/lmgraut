import express from "express";
import {
    getAutos,
    createAuto,
    deleteAuto,
    updateAuto
} from "../controllers/autosController.js";

const router = express.Router();

router.get("/", getAutos);
router.post("/", createAuto);
router.delete("/:id", deleteAuto);
router.put("/:id", updateAuto);

export default router;
