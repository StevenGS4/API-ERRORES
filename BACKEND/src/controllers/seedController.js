import ZTERRORLOG from "../models/errorModel.js";

export const seedErrors = async (req, res) => {
  try {
    const sampleErrors = [
      {
        ERRORID: 192883,
        ERRORMESSAGE: "Oh no! A breakdown in the mission uploading file! Give it another shot!",
        ERRORCODE: "TypeError: Cannot read property 'email' of undefined",
        ERRORSOURCE: "Login.js"
      },
      {
        ERRORID: 192884,
        ERRORMESSAGE: "Failed to fetch data from API endpoint /user/profile",
        ERRORCODE: "NetworkError: ECONNREFUSED",
        ERRORSOURCE: "ProfileService.js"
      },
      {
        ERRORID: 192885,
        ERRORMESSAGE: "Unhandled promise rejection when saving user settings",
        ERRORCODE: "PromiseRejectionError",
        ERRORSOURCE: "SettingsForm.js"
      },
      {
        ERRORID: 192886,
        ERRORMESSAGE: "Cannot connect to database",
        ERRORCODE: "ECONNREFUSED",
        ERRORSOURCE: "db.js"
      }
    ];

    await ZTERRORLOG.deleteMany({});
    await ZTERRORLOG.insertMany(sampleErrors);

    res.json({ message: "Errores de prueba cargados correctamente", count: sampleErrors.length });
  } catch (error) {
    console.error("Error al insertar errores de prueba:", error);
    res.status(500).json({ message: "Error al insertar errores de prueba", error });
  }
};
