import React from "react";
import { observer, inject } from "mobx-react";

export const Options = inject("state")(
  observer(function Options({ state }) {
    return (
      <div className="no-phone option">
        <div className="option-wrapper">
          <div>
            <p>qunate ore guardi al giorno</p>
            <p>
              Dopo che avrai settato le ore non padrai modificarlo se non
              refreshando la pagina perdendo così tutte le serie fino ad ora
              selezionate.
            </p>
          </div>
          <div className="group-btn-option">
            <button onClick={state.addOption}>+</button>
            <p>{state.option}</p>
            <button onClick={state.decOption}>-</button>
          </div>
        </div>
      </div>
    );
  })
);
