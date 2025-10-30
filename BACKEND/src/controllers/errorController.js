import ZTERRORLOG from "../models/errorModel.js";


export const getAllErrors = async (req, res) => {
  try {
    const errors = await ZTERRORLOG.find().sort({ ERRORDATETIME: -1 });
    res.json(errors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching errors", error });
  }
};


export const createError = async (req, res) => {
  try {
    const { ERRORMESSAGE, ERRORCODE, ERRORSOURCE, ERRORUSER, STATUS } = req.body;

    const newError = new ZTERRORLOG({
      ERRORMESSAGE,
      ERRORCODE,
      ERRORSOURCE,
      ERRORUSER: ERRORUSER || "Unknown user",
      STATUS: STATUS || "Failed",
    });

    await newError.save();
    res.status(201).json({ message: "Error registrado correctamente", newError });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar", error });
  }
};


export const deleteError = async (req, res) => {
  try {
    const { id } = req.params;
    await ZTERRORLOG.findOneAndDelete({ ERRORID: id });
    res.json({ message: "Error eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar", error });
  }
};
