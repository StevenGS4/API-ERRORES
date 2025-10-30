import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Tabs from "../components/Tabs";
import { getErrorById, updateErrorStatus } from "../services/errorService";
import "../styles/errordetail.css";

const ErrorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getErrorById(id).then((res) => {
      setError(res);
      setLoading(false);
    });
  }, [id]);

  const handleStatusChange = async (status) => {
    const confirmMsg =
      status === "RESOLVED"
        ? "¿Marcar este error como RESUELTO?"
        : "¿Ignorar este error?";
    if (!window.confirm(confirmMsg)) return;

    const success = await updateErrorStatus(id, status);
    if (success) {
      alert(`Error marcado como ${status}`);
      navigate("/errors");
    } else {
      alert("No se pudo actualizar el estado del error");
    }
  };

  if (loading) return <p className="loading">Cargando...</p>;
  if (!error) return <p className="loading">No se encontró información del error.</p>;

  const fecha = error.ERRORDATETIME
    ? new Date(error.ERRORDATETIME).toLocaleString("es-MX", {
      dateStyle: "medium",
      timeStyle: "short",
    })
    : "Fecha desconocida";

  const tabs = [
    {
      label: "Descripción del Error",
      content: (
        <div className="error-summary">
          <p><strong>Mensaje:</strong> {error.ERRORMESSAGE}</p>
          <p><strong>Código:</strong> {error.ERRORCODE}</p>
          <p><strong>Origen:</strong> {error.ERRORSOURCE}</p>
          <p><strong>Severidad:</strong> {error.SEVERITY}</p>
          <p><strong>Módulo:</strong> {error.MODULE}</p>
          <p><strong>Aplicación:</strong> {error.APPLICATION}</p>
          <p><strong>Usuario:</strong> {error.USER}</p>
          <p><strong>Fecha:</strong> {fecha}</p>
        </div>
      ),
    },
    {
      label: "Contexto Técnico",
      content: (
        <pre className="context-pre">
          {JSON.stringify(error.CONTEXT, null, 2) || "Sin información de contexto"}
        </pre>
      ),
    },
    {
      label: "Asistencia IA",
      content: (
        <div className="ai-container">
          {/* 🔹 Encabezado con botón "Solucionar error" */}
          <div className="ai-header">
            <h4>Asistencia generada por IA</h4>
            <button
              className="ai-fix-btn"
              onClick={async () => {
                const aiText = await getAISolution(error.ERRORMESSAGE, JSON.stringify(error.CONTEXT || {}));
                alert("💡 Solución sugerida:\n\n" + aiText);
              }}
            >
              💡 Solucionar error
            </button>

          </div>

          {/* 🔹 Mensaje de IA */}
          <div className="ai-response">
            {error.AI_RESPONSE || "No se generó respuesta de inteligencia artificial."}
          </div>

          {/* 🔹 Sección para comentar solución */}
          <div className="comment-box">
            <div className="comment-header">
              <img
                src="https://i.pravatar.cc/45?u=Admin"
                alt="Usuario"
                className="comment-avatar"
              />
              <div>
                <p className="comment-user">Admin (Tú)</p>
                <p className="comment-hint">Describe cómo solucionaste el error:</p>
              </div>
            </div>
            <textarea
              className="comment-input"
              placeholder="Ejemplo: Reemplacé la llamada fetchData() por fetchUsers() y corregí el import..."
              rows="3"
            ></textarea>
            <button className="comment-send">💾 Guardar comentario</button>
          </div>
        </div>
      ),
    },
  ];


  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Navbar />
        <div className="detail-container">
          <h2>
            🧩 Detalle del Error — <span className="error-id">{error.ERRORCODE}</span>
          </h2>
          <div className="detail-header">
            <img
              src={`https://i.pravatar.cc/70?u=${error.USER || "user"}`}
              alt="Avatar"
              className="detail-avatar"
            />
            <div>
              <h3>{error.ERRORMESSAGE}</h3>
              <p className="detail-sub">
                {error.USER || "Sin usuario"} — {fecha}
              </p>
            </div>
            <span className={`status-tag ${error.STATUS?.toLowerCase()}`}>
              {error.STATUS}
            </span>
          </div>

          <Tabs tabs={tabs} />

          <div className="buttons">
            <button
              className="ignore"
              onClick={() => handleStatusChange("IGNORED")}
            >
              🚫 Ignorar
            </button>
            <button
              className="resolve"
              onClick={() => handleStatusChange("RESOLVED")}
            >
              ✅ Marcar Resuelto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorDetail;
