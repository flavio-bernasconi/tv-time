import React, { useState, useEffect } from "react";
import "./App.css";
import { SingleMovie } from "./components/SingleMovie";
import { DrawChart } from "./components/DrawChart";
import { Complete } from "./components/Complete";
import { State } from "./state";
import { Provider } from "mobx-react";
import { DisplayNumber } from "./components/DisplayNumber";

const state = State.create({});

window.STATE = state;

function createBaseChart(isVisible) {
  return (
    <div className={`chart-container ${isVisible ? "db" : "dn"}`}>
      <div className="tooltip">
        <p className="text-tooltip"></p>
      </div>
      <svg className="chart">
        <g className="zoom-layer">
          <g className="year-circle">
            <circle className="fix" />
            <circle className="var" />
          </g>
          <g className="year-rect">
            <rect className="rect-fix" />
            <rect className="rect-var" />
          </g>
          <g className="groupNodes"></g>
        </g>
      </svg>
    </div>
  );
}

export function App() {
  const [isChartVisible, setIsChartVisible] = useState(false);

  useEffect(() => {
    state.setIsVisible();
  }, [isChartVisible]);

  console.log(isChartVisible);

  return (
    <Provider state={state}>
      <>
        <div
          className="btn-graph"
          onClick={() => {
            setIsChartVisible(!isChartVisible);
          }}
        >
          See chart
        </div>

        {createBaseChart(isChartVisible)}

        <div className="fix">
          <DisplayNumber />
          <Complete />
        </div>

        {isChartVisible ? (
          <>
            <DrawChart />
          </>
        ) : (
          <>
            <div className="container">
              <div className="list-movies">
                <SingleMovie />
              </div>
            </div>
          </>
        )}
      </>
    </Provider>
  );
}
