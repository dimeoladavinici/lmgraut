import express from "express";
import {
    uploadFotoMiddleware,
    processUpload
} from "../controllers/uploadController.js";

const router = express.Router();

router.post("/", uploadFotoMiddleware, processUpload);

export default router;
