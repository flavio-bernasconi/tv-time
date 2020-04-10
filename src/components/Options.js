import React from "react";
import { observer, inject } from "mobx-react";

export const Options = inject("state")(
  observer(function Options({ state }) {
    return (
      <>
        <div className={`option-bk ${state.isOptionHidden && "dn"}`}> </div>
        <div className={` option ${state.isOptionHidden && "dn"}`}>
          <div className="option-wrapper">
            <div className="text-option">
              <h3>Quante ore guardi al giorno</h3>
            </div>
            <div className="group-btn-option">
              <button onClick={state.addOption}>+</button>
              <p className="number-hour-watched">{state.option}</p>
              <button onClick={state.decOption}>-</button>

              <button className="setHour-btn" onClick={state.setIsOptionHidden}>
                set hours
              </button>
            </div>
            <p>
              *Consiglio di settare le ore a 24 perchè vedere effettivamente
              quando giorni si impiegano per vedere le serie o per esempio
              togliendo 8 ore di sonno quindi settarlo a 16
            </p>
          </div>
        </div>
      </>
    );
  })
);
