import React from "react";

export function Button({ label, fun }) {
  return (
    <div className={`btn-chart`} onClick={fun}>
      {label}
    </div>
  );
}
