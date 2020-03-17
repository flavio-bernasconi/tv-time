import React from "react";
import { observer, inject } from "mobx-react";
import { Trail } from "react-spring/renderprops";

export const FamouseSeries = inject("state")(
  observer(function DisplayFamousSeries({ state }) {
    const { listFamousSerie, setMovieSelected, removeFamousSerie } = state;
    listFamousSerie.map(el => el);

    return (
      <>
        <Trail
          items={listFamousSerie}
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
            return (
              <div
                onClick={() => {
                  setMovieSelected(serie.id);
                  removeFamousSerie(serie.id);
                }}
                style={{
                  backgroundImage: `linear-gradient(white, blue),url(https://image.tmdb.org/t/p/w300${serie.poster})`,
                  backgroundBlendMode: "color",
                  marginRight: 10,
                  marginTop: 10,
                  ...props
                }}
                className="famous-serie"
              />
            );
          }}
        </Trail>
        {/* {listFamousSerie.map(({ id, poster }) => (
          <div
            key={id}
            onClick={() => {
              setMovieSelected(id);
              removeFamousSerie(id);
            }}
            style={{
              backgroundImage: `linear-gradient(white, blue),url(https://image.tmdb.org/t/p/w300${poster})`,
              backgroundBlendMode: "color",
              marginRight: 10,
              marginTop: 10
            }}
            className="famous-serie"
          />
        ))} */}
      </>
    );
  })
);
