import React, { useState } from "react";

export function Button({ label, fun, optionaClass }) {
  return (
    <div
      className={`btn-chart ${optionaClass} `}
      onClick={() => {
        fun();
      }}
    >
      {label}
    </div>
  );
}
