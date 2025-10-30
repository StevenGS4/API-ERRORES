import React from "react";
import { Link } from "react-router-dom";
import "../styles/errorlog.css";

const ErrorCard = ({ error }) => {
  return (
    <div className="error-item">
      <div className="dot"></div>
      <div className="error-card">
        <Link to={`/errors/${error.ERRORID}`} className="error-link">
          <div className="error-card-header">
            <img
              src={`https://i.pravatar.cc/50?u=${error.ERRORID}`}
              alt={error.ERRORUSER || "User"}
              className="error-avatar"
            />
            <div>
              <h3 className="error-title">
                Error {error.ERRORCODE || error.ERRORID}
              </h3>
              <p className="error-user">
                {error.ERRORUSER || "Unknown User"} — Task ID #{error.ERRORID}
              </p>
            </div>
            <span className="status resolved">Resolved</span>
          </div>

          <p className="error-message">
            {error.ERRORMESSAGE ||
              "No message available, this is a simulated example..."}
          </p>
        </Link>
      </div>
    </div>
  );
};

export default ErrorCard;
