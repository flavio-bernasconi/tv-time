import React from "react";
import { timeConvert } from "./utils";
import { observer, inject } from "mobx-react";
import { Trail } from "react-spring/renderprops";

export const SingleMovie = inject("state")(
  observer(function SingleMovie({ state }) {
    const { deleteMovie, listMovieSelected } = state;

    return (
      <div className="poster-container rel">
        <h1 className="full">
          selected <span>{state.dataset.length}</span>
        </h1>
        <Trail
          items={listMovieSelected.slice().reverse()}
          keys={serie => serie.id}
          from={{
            marginTop: 10,
            marginLeft: -20,
            opacity: 0,
            transform: "translate3d(0,-40px,0)"
          }}
          to={{
            marginTop: 10,
            marginLeft: 20,
            opacity: 1,
            transform: "translate3d(0,0px,0)"
          }}
        >
          {serie => props => {
            const min = serie.number_of_episodes * serie.episode_run_time[0];
            const {
              monthsCounter,
              daysCounter,
              hoursCounter,
              minutesCounter
            } = timeConvert(min);

            return (
              <div key={serie.id} style={props} className="poster-item rel">
                <button onClick={() => deleteMovie(serie)}>X</button>
                <div
                  className="img-bk"
                  style={{
                    backgroundImage: `linear-gradient(white, blue),url(https://image.tmdb.org/t/p/w500${serie.poster_path})`,
                    backgroundBlendMode: "color"
                  }}
                />
                {/* <h3>{serie.name}</h3>
                <p>{serie.number_of_episodes} ep</p>
                <p>{serie.episode_run_time[0]} mins each</p>*/}
                <div className="single-counter">
                  {monthsCounter > 0 ? (
                    <>
                      <p>month</p>
                      <span className="card-number">{monthsCounter} </span>
                    </>
                  ) : null}

                  {daysCounter > 0 ? (
                    <>
                      <p>day</p>
                      <span className="card-number">{daysCounter} </span>
                    </>
                  ) : null}

                  {hoursCounter > 0 ? (
                    <>
                      <p>hour</p>
                      <span className="card-number">{hoursCounter} </span>
                    </>
                  ) : null}

                  <p>min</p>
                  <span className="card-number">{minutesCounter}</span>
                </div>
              </div>
            );
          }}
        </Trail>
      </div>
    );
  })
);
