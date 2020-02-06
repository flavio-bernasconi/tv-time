import React from "react";

export const SingleMovie = props => {
  const { listMoviesSelected, deleteMovie } = props;

  const getFilmToDelete = movieToDelete => {
    deleteMovie(movieToDelete);
  };

  return (
    <div className="poster-container">
      {listMoviesSelected.map((singleMovie, index) => {
        return (
          <div key={index} className="poster-item">
            <button onClick={e => getFilmToDelete(singleMovie)}>X</button>
            <img
              src={`https://image.tmdb.org/t/p/w154${singleMovie.poster_path}`}
              alt="serie-poster-img"
            />
            <h3>{singleMovie.name}</h3>
            <p>{singleMovie.number_of_episodes} episodes</p>
          </div>
        );
      })}
    </div>
  );
};
