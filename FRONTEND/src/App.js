import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ErrorLog from "./pages/ErrorLog";
import ErrorDetail from "./pages/ErrorDetail";
import "./styles/main.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/errors" element={<ErrorLog />} />
        <Route path="/errors/:id" element={<ErrorDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
