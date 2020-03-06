import React from "react";
import { observer, inject } from "mobx-react";

export const FamouseSeries = inject("state")(
  observer(function DisplayFamousSeries({ state }) {
    const { listFamousSerie, setMovieSelected, removeFamousSerie } = state;

    return (
      <>
        {listFamousSerie.map(({ id, poster }) => (
          <div
            onClick={() => {
              setMovieSelected(id);
              removeFamousSerie(id);
            }}
            style={{
              backgroundImage: `linear-gradient(white, blue),url(https://image.tmdb.org/t/p/w500${poster})`,
              backgroundBlendMode: "color"
            }}
            className="famous-serie"
          />
        ))}
      </>
    );
  })
);
