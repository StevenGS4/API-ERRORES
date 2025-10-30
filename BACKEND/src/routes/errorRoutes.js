import express from "express";
import { getAllErrors, createError, deleteError } from "../controllers/errorController.js";
import { seedErrors } from "../controllers/seedController.js"; // 👈 importante

const router = express.Router();

router.get("/", getAllErrors);
router.post("/", createError);
router.delete("/:id", deleteError);
router.get("/seed", seedErrors); // 👈 usa GET para probar fácilmente desde navegador

export default router;
