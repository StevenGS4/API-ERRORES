import mongoose from "mongoose";

const ErrorSchema = new mongoose.Schema({
  // 🔹 Genera un ID automático basado en timestamp
  ERRORID: {
    type: String,
    default: function () {
      return Math.floor(100000 + Math.random() * 900000).toString(); // Ejemplo: "192883"
    },
  },
  ERRORMESSAGE: { type: String, required: true },
  ERRORCODE: { type: String, required: true },
  ERRORSOURCE: { type: String },
  ERRORUSER: { type: String },
  ERRORDATETIME: { type: Date, default: Date.now },
  STATUS: {
    type: String,
    enum: ["Failed", "Resolved", "Ignored"],
    default: "Failed",
  },
});

export default mongoose.model("Error", ErrorSchema);
