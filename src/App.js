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
import { Spring } from "react-spring/renderprops";
import { BubbleChart } from "./components/BubbleChart";
import { SquaresChart } from "./components/SquaresChart";
import { Options } from "./components/Options";

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
          <g className="genres-nodes"></g>
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
    isHomeVisible,
    setIsSquareVisible,
    isSquareVisible,
  } = state;

  useEffect(() => {
    getIdFamousSerie();
  }, [getIdFamousSerie]);

  return (
    <Provider state={state}>
      <>
        {state.dataset.length === 0 && <Options />}

        {isListVisible && <BubbleChart />}

        {createBaseChart(isChartVisible, isListVisible, isCircleVisible)}

        <div className="counter-input ">
          <Spring
            from={{
              opacity: 0,
              marginTop: -1000,
            }}
            to={{
              opacity: 1,
              marginTop: 0,
            }}
          >
            {(props) => (
              <div style={props}>
                {isHomeVisible && (
                  <>
                    <DisplayNumber /> <Complete />
                  </>
                )}
              </div>
            )}
          </Spring>
        </div>

        {isChartVisible && <DrawChart />}

        {isSquareVisible && <SquaresChart />}

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
          </>
        )}

        <div className="container-btn">
          <div className="small-counter no-pc">
            <DisplayNumber />
          </div>
          <div className="series-counter">
            <p>Num. Series</p>
            <span>{state.dataset.length}</span>
          </div>
          {isChartVisible && (
            <>
              <div className="small-counter">
                <DisplayNumber />
              </div>
              <div className="btn-group">
                <Button
                  label={"genres"}
                  fun={() => {
                    setIsListVisible(true);
                    setIsHomeVisible(false);
                    setIsCircleVisible(false);
                    setIsSquareVisible(false);
                    createBaseChart(
                      isChartVisible,
                      isListVisible,
                      isCircleVisible
                    );
                  }}
                  optionaClass="no-phone"
                />
                <Button
                  label={"square"}
                  fun={() => {
                    setIsSquareVisible(true);
                    setIsHomeVisible(false);
                    setIsCircleVisible(false);
                    setIsListVisible(false);
                  }}
                  // optionaClass="no-phone"
                />
                <Button
                  label="bubble"
                  fun={() => {
                    setIsChartVisible(true);
                    setIsCircleVisible(true);
                    setIsSquareVisible(false);
                    setIsHomeVisible(false);
                    setIsListVisible(false);
                  }}
                  // optionaClass="no-phone"
                />
                <Button
                  label="home"
                  fun={() => {
                    setIsChartVisible(false);
                    setIsInputOpen(true);
                    setIsHomeVisible(true);
                    setIsListVisible(false);
                    setIsSquareVisible(false);
                  }}
                />
              </div>
            </>
          )}
          {isHomeVisible && state.dataset.length > 0 && (
            <Button
              label="charts"
              fun={() => {
                setIsChartVisible(true);
                setIsCircleVisible(true);
                setIsInputOpen(false);
                setIsHomeVisible(false);
                setIsListVisible(false);
                setIsSquareVisible(false);
              }}
            />
          )}
        </div>
      </>
    </Provider>
  );
});
