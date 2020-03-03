import React from "react";
import { timeConvert } from "./utils";
import { observer, inject } from "mobx-react";

export const SingleMovie = inject("state")(
  observer(function SingleMovie({ state }) {
    const list = state.listMovieSelected;

    return (
      <div className="poster-container">
        {list.map((singleMovie, index) => {
          const min =
            singleMovie.number_of_episodes * singleMovie.episode_run_time[0];
          const {
            monthsCounter,
            daysCounter,
            hoursCounter,
            minutesCounter
          } = timeConvert(min);

          return (
            <div key={index} className="poster-item">
              <button onClick={e => state.deleteMovie(singleMovie)}>X</button>
              <div
                className="img-bk"
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/w500${singleMovie.poster_path})`
                }}
              ></div>
              <p>{singleMovie.number_of_episodes} episodes</p>
              <p>{singleMovie.episode_run_time[0]} mins each</p>
              <p>
                {monthsCounter > 0 ? monthsCounter + "month" : null}
                {daysCounter > 0 ? daysCounter + "day" : null}
                {hoursCounter > 0 ? hoursCounter + "hours" : null}
                {minutesCounter}min
              </p>
            </div>
          );
        })}
      </div>
    );
  })
);
