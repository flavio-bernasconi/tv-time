import React from "react";
import { observer, inject } from "mobx-react";
import { cloneDeep } from "lodash";
import { timeConvert, getDays } from "./utils";

export const SquaresChart = inject("state")(
  observer(function SquaresChart({ state }) {
    const getterDays = Math.round(getDays(state.counter));
    const days = new Array(getterDays).fill(1);
    let multi = getterDays > 364 ? 3 : 1;

    const year = new Array(365 * multi - getterDays).fill(0);

    function shuffle(array) {
      return array.sort(() => Math.random() - 0.5);
    }

    const join = shuffle([...days, ...year]);

    return (
      <>
        <div className="legend">
          <p>description</p>
          <p>Free days</p>
          <div className="day free"></div>
          <p>Gone</p>
          <div className="day spent"></div>
          <div className="displayfree">
            <h3>gone : {days.length}</h3>
            <h3>free : {year.length}</h3>
          </div>
        </div>
        <div className="container-days">
          {join.map((x, i) => (
            <div key={i} className={`day ${x === 1 ? "spent" : "free"}`}></div>
          ))}
        </div>
      </>
    );
  })
);
