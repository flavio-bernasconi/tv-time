import React from "react";

export function Button({ label, fun, position }) {
  return (
    <div style={position} className={`btn-chart`} onClick={fun}>
      {label}
    </div>
  );
}
