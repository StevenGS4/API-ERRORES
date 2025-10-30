import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import errorRoutes from "./routes/errorRoutes.js";

dotenv.config();

const app = express();
app.use(cors()); // 👈 Importante
app.use(express.json());

app.use("/api/errors", errorRoutes);

export default app;
