import React from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Tabs from "../components/Tabs";
import "../styles/errordetail.css";

const ErrorDetail = () => {
  const { id } = useParams();

  const tabs = [
    { label: "Error Summary", content: <p>Summary info for Task ID #{id}...</p> },
    { label: "Solution", content: <p>Suggested fix or user-provided solution.</p> },
    { label: "AI Solution", content: <p>AI-generated assistance (future).</p> },
  ];

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Navbar />
        <div className="detail-container">
          <h2>Error Details — Task #{id}</h2>
          <Tabs tabs={tabs} />
          <div className="buttons">
            <button className="ignore">Ignore</button>
            <button className="resolve">Mark Resolved</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorDetail;
