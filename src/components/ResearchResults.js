import React from "react";

export const ResearchResults = props => {
  const { resultsList, setMovieSelected, resetResearchResults } = props;
  return (
    <ul className="results-list">
      {resultsList.map(nameMovie => {
        return (
          <li key={nameMovie.id}>
            <button
              className="results-list-item"
              onClick={e => {
                setMovieSelected(e.target.value);
                resetResearchResults();
              }}
              value={nameMovie.id}
              key={nameMovie.id}
            >
              {nameMovie.original_name}
            </button>
          </li>
        );
      })}
    </ul>
  );
};
