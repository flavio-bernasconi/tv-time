import React, { useEffect } from "react";
import "./App.css";
import { SingleMovie } from "./components/SingleMovie";
import { DrawChart } from "./components/DrawChart";
import { Complete } from "./components/Complete";
import { State } from "./state";
import { Provider, observer } from "mobx-react";
import { DisplayNumber } from "./components/DisplayNumber";
import { Button } from "./components/Button";
import { FamouseSeries } from "./components/FamousSeries";
import { DragSerie } from "./components/DragSerie";
import { Spring, useSpring, animated } from "react-spring/renderprops";
import { BubbleChart } from "./components/BubbleChart";

const state = State.create({});

window.STATE = state;

function createBaseChart(isChartVisible, isListVisible, isCircleVisible) {
  return (
    <div className={`chart-container ${isChartVisible ? "db" : "dn"}`}>
      <div className="tooltip">
        <p className="text-tooltip"></p>
      </div>
      <svg className="chart">
        <g className={`zoom-layer  ${isCircleVisible ? "db" : "dn"}`}>
          <g className="year-circle">
            <circle className="fix" />
            <circle className="var" />
          </g>
          <g className="groupNodes"></g>
        </g>
        <g className={`bubbles ${isListVisible ? "db" : "dn"}`}>
          <g className="bubble-zoom">
            <g className="genres-nodes"></g>
          </g>
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
    getIdFamousSerie,
    isListVisible,
    setIsListVisible,
    setIsHomeVisible,
    isCircleVisible,
    setIsCircleVisible,
    isHomeVisible
  } = state;

  useEffect(() => {
    getIdFamousSerie();
  }, []);

  return (
    <Provider state={state}>
      <>
        {isChartVisible && (
          <Button
            label={`${isListVisible ? "back to the chart" : "group by genre"}`}
            position={{ bottom: 25, right: 180 }}
            fun={() => {
              setIsHomeVisible(false);
              setIsListVisible(!isListVisible);
              setIsCircleVisible(!isCircleVisible);
              createBaseChart(isChartVisible, isListVisible, isCircleVisible);
            }}
          />
        )}

        {isListVisible && <BubbleChart />}

        {createBaseChart(isChartVisible, isListVisible, isCircleVisible)}

        <div className="counter-input">
          <Spring
            from={{
              opacity: 0,
              marginTop: -1000
            }}
            to={{
              opacity: 1,
              marginTop: 0
            }}
          >
            {props => (
              <div style={props}>
                <DisplayNumber />
                <Complete />
              </div>
            )}
          </Spring>
        </div>

        {isChartVisible && (
          <>
            <Button
              label="home"
              position={{ bottom: 25, right: 25 }}
              fun={() => {
                setIsChartVisible(false);
                setIsInputOpen(true);
                setIsHomeVisible(true);
                setIsListVisible(false);
              }}
            />
            <DrawChart />
          </>
        )}

        {isHomeVisible && (
          <>
            <div className="container-famous">
              <FamouseSeries />
            </div>
            <div className="container">
              <div className="list-movies">
                <SingleMovie />
              </div>
            </div>
            <Button
              label="chart"
              position={{ bottom: 25, right: 25 }}
              fun={() => {
                setIsChartVisible(true);
                setIsInputOpen(false);
                setIsHomeVisible(false);
                setIsListVisible(false);
                setIsCircleVisible(true);
              }}
            />
          </>
        )}
      </>
    </Provider>
  );
});
