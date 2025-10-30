import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // <-- Esto es lo que carga .env

export const connectDB = async () => {
  try {
    const uri = process.env.DB_URL_LOCAL;
    console.log("📡 Conectando a MongoDB:", uri); // 👈 para debug temporal
    await mongoose.connect(uri);
    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error.message);
  }
};
