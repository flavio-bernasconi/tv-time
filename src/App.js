import React, { useEffect } from "react";
import "./App.css";
import { SingleMovie } from "./components/SingleMovie";
import { DrawChart } from "./components/DrawChart";
import { Complete } from "./components/Complete";
import { State } from "./state";
import { Provider, observer } from "mobx-react";
import { DisplayNumber } from "./components/DisplayNumber";
import { Button } from "./components/Button";
import { AppDragDropDemo } from "./components/DragSerie";
import { FamouseSeries } from "./components/FamousSeries";

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
          {/* <g className="year-rect">
            <rect className="rect-fix" />
            <rect className="rect-var" />
          </g> */}
          <g className="groupNodes"></g>
        </g>
      </svg>
    </div>
  );
}

export const Home = observer(function App() {
  const {
    isChartVisible,
    setIsChartVisible,
    setIsInputOpen,
    getIdFamousSerie
  } = state;

  useEffect(() => {
    getIdFamousSerie();
  }, []);

  return (
    <Provider state={state}>
      <>
        {/* <AppDragDropDemo /> */}

        {isChartVisible ? (
          <Button
            label={"home"}
            fun={() => {
              setIsChartVisible(false);
              setIsInputOpen(true);
            }}
          />
        ) : (
          <Button
            label={"chart"}
            fun={() => {
              setIsChartVisible(true);
              setIsInputOpen(false);
            }}
          />
        )}

        {createBaseChart(isChartVisible)}

        {!isChartVisible && (
          <div className="container-famous">
            <FamouseSeries />
          </div>
        )}

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
});
