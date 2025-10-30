import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ErrorCard from "../components/ErrorCard";
import { getErrors, createError } from "../services/errorService";
import "../styles/errorlog.css";

const ErrorLog = () => {
  const [errors, setErrors] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [lastUpdate, setLastUpdate] = useState(null);

  // 🔹 Función central de carga
  const loadErrors = async () => {
    const data = await getErrors();
    setErrors(data);
    setLastUpdate(new Date().toLocaleTimeString());
  };

  // 🔹 Cargar errores al iniciar
useEffect(() => {
  getErrors().then((data) => {
    console.log("🧩 Datos cargados:", data);
    setErrors(data);
  });
}, []);



  // 🔄 Actualización automática cada 10 segundos
  useEffect(() => {
    const interval = setInterval(loadErrors, 10000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Crear un error de ejemplo
  const handleCreateError = async () => {
    const nuevo = {
      ERRORMESSAGE: "Error simulado desde frontend",
      ERRORCODE: "ERR-FRONT",
      ERRORSOURCE: "ReactUI",
      SEVERITY: "ERROR",
      MODULE: "Interfaz",
      APPLICATION: "ErrorManager",
      USER: "Admin",
    };
    const ok = await createError(nuevo);
    if (ok) {
      alert("✅ Error creado exitosamente");
      loadErrors(); // recargar lista
    } else {
      alert("❌ Falló al crear el error");
    }
  };

  // 🔹 Filtros combinados (por texto + estado)
  const filteredErrors = errors
    .filter((e) =>
      e.ERRORMESSAGE?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((e) => {
      if (filter === "ALL") return true;
      if (filter === "UNRESOLVED")
        return e.STATUS === "NEW" || e.STATUS === "IN_PROGRESS";
      if (filter === "RESOLVED") return e.STATUS === "RESOLVED";
      if (filter === "IGNORED") return e.STATUS === "IGNORED";
      return true;
    });
     console.log("🔍 Errores que se renderizan:", filteredErrors);

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Navbar />
        <div className="errorlog-container">
          <h2>Error Log</h2>

          {/* 🔹 Filtros superiores */}
          <br></br>
          <div className="error-filters">
            <div className="filter-buttons">
              <button
                onClick={() => setFilter("ALL")}
                className={filter === "ALL" ? "active" : ""}
              >
                All Errors
              </button>
              <button
                onClick={() => setFilter("UNRESOLVED")}
                className={`unresolved ${
                  filter === "UNRESOLVED" ? "active" : ""
                }`}
              >
                Unresolved
              </button>
              <button
                onClick={() => setFilter("RESOLVED")}
                className={`resolved ${
                  filter === "RESOLVED" ? "active" : ""
                }`}
              >
                Resolved
              </button>
              <button
                onClick={() => setFilter("IGNORED")}
                className={filter === "IGNORED" ? "active" : ""}
              >
                Ignored
              </button>
            </div>

            {/* 🔍 Buscador */}
            <div className="search-section">
              <input
                type="text"
                placeholder="Search by message, code, or source..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value.toUpperCase())}
              >
                <option value="ALL">All</option>
                <option value="RESOLVED">Resolved</option>
                <option value="UNRESOLVED">Unresolved</option>
                <option value="IGNORED">Ignored</option>
              </select>
            </div>
            
          </div>
                
          {/* 🔹 Timeline */}
          
          <div className="timeline">
            
            {filteredErrors.length === 0 ? (
              <p>No errors found</p>
              
            ) : (
              filteredErrors.map((err) => (
                <ErrorCard key={err.ERRORID || err._id} error={err}  />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorLog;
