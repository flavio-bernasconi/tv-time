import React from "react";

export function Button({ label, fun, optionaClass }) {
  return (
    <div
      className={`btn-chart ${optionaClass !== undefined && optionaClass} `}
      onClick={() => {
        fun();
      }}
    >
      {label}
    </div>
  );
}
