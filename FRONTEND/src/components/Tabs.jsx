import React, { useState } from "react";
import "../styles/errordetail.css";

const Tabs = ({ tabs }) => {
  const [active, setActive] = useState(0);
  return (
    <div className="tabs-container">
      <div className="tab-buttons">
        {tabs.map((tab, i) => (
          <button
            key={i}
            className={active === i ? "active" : ""}
            onClick={() => setActive(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">{tabs[active].content}</div>
    </div>
  );
};

export default Tabs;
