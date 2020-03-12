import React from "react";

export function Button({ label, fun, align }) {
  return (
    <div
      className={`btn-chart ${align === "left" ? "left" : "right"}`}
      onClick={fun}
    >
      {label}
    </div>
  );
}
