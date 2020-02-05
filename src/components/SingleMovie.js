import React from "react";

export const SingleMovie = props => {
  const { listMoviesSelected } = props;

  return (
    <div className="poster-container">
      {listMoviesSelected.map((singleMovie, index) => {
        return (
          <div key={index} className="poster-item">
            {/* <img
              src={`https://image.tmdb.org/t/p/w154${singleMovie.poster_path}`}
            ></img> */}
            <p>{singleMovie.name}</p>
          </div>
        );
      })}
    </div>
  );
};
