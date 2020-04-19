import React from "react";
import { timeConvert } from "./utils";
import { observer, inject } from "mobx-react";
import { Spring } from "react-spring/renderprops";

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
              to={{ number }}
              key={Math.random()}
              config={{
                duration: 1500
              }}
            >
              {props => (
                <div>
                  <p>
                    {label}
                    {props.number > 0 && "s"}
                  </p>
                  <h1>{props.number.toFixed()}</h1>
                </div>
              )}
            </Spring>
          ))}
        </div>
      </div>
    );
  })
);
