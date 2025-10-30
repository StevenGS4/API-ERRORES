// 🔹 URL base del servicio CDS
const API_BASE = "http://localhost:3333/odata/v4/api/error/crud";


export const getErrors = async () => {
  try {
    const res = await fetch(
      `${API_BASE}?queryType=getAll&LoggedUser=Admin&dbServer=Mongo`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }
    );

    const data = await res.json();
    console.log("📡 Respuesta del backend CAP:", data);

    if (!data.data) {
      console.warn("⚠️ No hay 'data' en la respuesta");
      return [];
    }

    // CAP envía data: [ [ {...}, {...} ] ]
    const arr =
      Array.isArray(data.data) && Array.isArray(data.data[0])
        ? data.data[0]
        : Array.isArray(data.data)
        ? data.data
        : [];

    console.log("✅ Errores procesados:", arr);

    return arr.map((err, index) => ({
      ERRORID: err._id || `ERR-${index + 1}`,
      ERRORMESSAGE: err.ERRORMESSAGE || "Sin mensaje",
      ERRORCODE: err.ERRORCODE || "N/A",
      ERRORSOURCE: err.ERRORSOURCE || "Desconocido",
      USER: err.USER || "Sin usuario",
      ERRORDATETIME: err.ERRORDATETIME || new Date().toISOString(),
      STATUS: err.STATUS || "NEW",
      SEVERITY: err.SEVERITY || "ERROR",
      MODULE: err.MODULE || "Desconocido",
      APPLICATION: err.APPLICATION || "No especificado",
    }));
  } catch (err) {
    console.error("❌ Error al conectar con CDS:", err);
    return [];
  }
};




export const getErrorById = async (id) => {
  try {
    const res = await fetch(
      `${API_BASE}?queryType=getOne&id=${id}&LoggedUser=Admin&dbServer=Mongo`,
      {
        method: "POST", // ⚠️ CAP solo acepta POST para actions
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }
    );

    if (!res.ok) throw new Error("Error al obtener el detalle del error");

    const data = await res.json();
    console.log("📡 Detalle del error:", data);

    if (data.data && Array.isArray(data.data)) {
      // El backend devuelve { data: [ { ... } ] }
      return data.data[0];
    }

    if (Array.isArray(data.data?.[0])) {
      return data.data[0][0];
    }

    return null;
  } catch (err) {
    console.error("Error al obtener detalle del error:", err);
    return null;
  }
};

export const getAISolution = async (errorMessage, context = "") => {
  try {
    const res = await fetch("http://localhost:3333/odata/v4/api/error/aiAssist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ errorMessage, context }),
    });
    const data = await res.json();
    return data.aiResponse || "No se pudo generar solución.";
  } catch (err) {
    console.error("❌ Error llamando IA:", err);
    return "Error generando asistencia IA.";
  }
};


/**
 * 🔹 Actualizar estado de un error (Resolved / Ignored)
 */
export const updateErrorStatus = async (id, newStatus) => {
  try {
    const body = {
      data: {
        _id: id,
        STATUS: newStatus,
      },
    };

    const res = await fetch(
      `${API_BASE}?queryType=update&LoggedUser=Admin&dbServer=Mongo`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();
    if (data.status === 200 || data.status === 201) {
      console.log("✅ Estado actualizado correctamente:", newStatus);
      return true;
    }

    console.error("Error en actualización:", data);
    return false;
  } catch (err) {
    console.error("Error al actualizar estado:", err);
    return false;
  }
};

/**
 * 🔹 Crear un nuevo error
 */
export const createError = async (errorData) => {
  try {
    const body = { data: errorData };

    const res = await fetch(
      `${API_BASE}?queryType=add&LoggedUser=Admin&dbServer=Mongo`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();
    if (data.status === 201) {
      console.log("✅ Error creado correctamente:", data);
      return true;
    }

    console.error("Error al crear error:", data);
    return false;
  } catch (err) {
    console.error("Error al conectar con CDS (create):", err);
    return false;
  }
};

/**
 * 🔹 (Opcional) Eliminar un error
 * Solo si luego agregas botón “Eliminar” en el frontend.
 */
export const deleteError = async (id) => {
  try {
    const res = await fetch(
      `${API_BASE}?queryType=delete&id=${id}&LoggedUser=Admin&dbServer=Mongo`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();
    return data.status === 200;
  } catch (err) {
    console.error("Error al eliminar:", err);
    return false;
  }
};
