import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getErrors } from "../services/errorService";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    unresolved: 0,
    resolved: 0,
    reported: 0,
    ignored: 0,
  });

  // 🔹 Cargar estadísticas en tiempo real desde la API CDS
  useEffect(() => {
    const fetchStats = async () => {
      const data = await getErrors(); // obtiene todos los errores
      if (data.length === 0) return;

      // Contar por STATUS
      const counts = {
        unresolved: data.filter(
          (e) => e.STATUS === "NEW" || e.STATUS === "IN_PROGRESS"
        ).length,
        resolved: data.filter((e) => e.STATUS === "RESOLVED").length,
        reported: data.length,
        ignored: data.filter((e) => e.STATUS === "IGNORED").length,
      };

      setStats(counts);
    };

    fetchStats();
    // 🔄 Refrescar cada 10 segundos
  const interval = setInterval(fetchStats, 10000);
  return () => clearInterval(interval);
  }, []);

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Navbar />
        <div className="dashboard-body">
          <h2>Welcome back, Administrator 👋</h2>
          <p>Here you can monitor and manage your application errors.</p>

          {/* 🔹 Tarjetas dinámicas */}
          <div className="dashboard-cards">
            <div className="card">
              <h3>{stats.unresolved}</h3>
              <p>Unresolved Errors</p>
            </div>
            <div className="card">
              <h3>{stats.resolved}</h3>
              <p>Resolved</p>
            </div>
            <div className="card">
              <h3>{stats.reported}</h3>
              <p>Reported</p>
            </div>
          </div>

          {/* 🔹 Tarjeta opcional para ignorados */}
          <div className="dashboard-cards" style={{ marginTop: "1.5rem" }}>
            <div className="card" style={{ backgroundColor: "#fff8e1" }}>
              <h3>{stats.ignored}</h3>
              <p>Ignored</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
