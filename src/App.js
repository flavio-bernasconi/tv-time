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

function createBaseChart(isVisible, isListVisible) {
  console.log(isVisible, isListVisible);

  return (
    <div className={`chart-container ${isVisible ? "db" : "dn"}`}>
      <div className="tooltip">
        <p className="text-tooltip"></p>
      </div>
      <svg className="chart">
        <g className={`zoom-layer  ${isListVisible ? "dn" : "db"}`}>
          <g className="year-circle">
            <circle className="fix" />
            <circle className="var" />
          </g>
          <g className="groupNodes"></g>
        </g>
        <g className="bubbles"></g>
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
    isHomeVisible
  } = state;

  useEffect(() => {
    getIdFamousSerie();
  }, []);

  console.log(isHomeVisible);

  return (
    <Provider state={state}>
      <>
        <Button
          label="list"
          position={{ bottom: 25, left: 25 }}
          fun={() => {
            setIsListVisible(true);
            setIsHomeVisible(false);
            createBaseChart(isChartVisible, isListVisible);
          }}
        />

        {isListVisible && <BubbleChart />}

        {createBaseChart(isChartVisible, isListVisible)}

        {!isChartVisible && (
          <div className="container-famous">
            <FamouseSeries />
          </div>
        )}

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

        {isChartVisible && <DrawChart />}

        {!isChartVisible && (
          <div className="container">
            <div className="list-movies">
              <SingleMovie />
            </div>
          </div>
        )}

        {isChartVisible ? (
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
        ) : (
          <Button
            label="chart"
            position={{ bottom: 25, right: 25 }}
            fun={() => {
              setIsChartVisible(true);
              setIsInputOpen(false);
              setIsHomeVisible(false);
              setIsListVisible(false);
            }}
          />
        )}
      </>
    </Provider>
  );
});
