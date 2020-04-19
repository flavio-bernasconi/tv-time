import React from "react";
import { observer, inject } from "mobx-react";
import { Trail } from "react-spring/renderprops";
import { SliderSerie } from "./SliderSerie";

export const FamouseSeries = inject("state")(
  observer(function DisplayFamousSeries({ state }) {
    const { listFamousSerie, setMovieSelected, removeFamousSerie } = state;
    listFamousSerie.map(el => el);

    return (
      <>
        <SliderSerie />
      </>
    );
  })
);
