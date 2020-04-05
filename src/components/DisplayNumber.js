import React from "react";
import { timeConvert } from "./utils";
import { observer, inject } from "mobx-react";
import { Spring } from "react-spring/renderprops";
import { Options } from "./Options";

export const DisplayNumber = inject("state")(
  observer(function DisplayNumber({ state }) {
    const {
      yearsCounter,
      monthsCounter,
      daysCounter,
      hoursCounter,
      minutesCounter
    } = timeConvert(state.counter, state.option);

    const numbers = [
      { number: yearsCounter, label: "year" },
      { number: monthsCounter, label: "month" },
      { number: daysCounter, label: "day" },
      { number: hoursCounter, label: "hour" },
      { number: minutesCounter, label: "minute" }
    ];

    return (
      <div className="counter">
        <div className="container-counters">
          {numbers.map(({ number, label }) => (
            <Spring
              from={{ number: 0 }}
              to={{ number: number }}
              key={Math.random()}
              config={{
                duration: 1500
              }}
            >
              {props => (
                <div>
                  <h1>
                    {props.number.toFixed()}
                    <span>
                      {label}
                      {props.number > 0 && "s"}
                    </span>
                  </h1>
                </div>
              )}
            </Spring>
          ))}
        </div>
        {state.dataset.length === 0 && <Options />}
      </div>
    );
  })
);
