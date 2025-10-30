import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

const Dashboard = () => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Navbar />
        <div className="dashboard-body">
          <h2>Welcome back, Administrator 👋</h2>
          <p>Here you can monitor and manage your application errors.</p>

          <div className="dashboard-cards">
            <div className="card">
              <h3>50</h3>
              <p>Unresolved Errors</p>
            </div>
            <div className="card">
              <h3>20990</h3>
              <p>Resolved</p>
            </div>
            <div className="card">
              <h3>2</h3>
              <p>Reported</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
