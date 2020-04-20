import React from "react";
import Swiper from "react-id-swiper";
import "swiper/css/swiper.css";
import { observer, inject } from "mobx-react";

export const SliderSerie = inject("state")(
  observer(function SliderSerie({ state }) {
    const { listFamousSerie } = state;

    const params = {
      slidesPerView: 8,
      spaceBetween: 30,
      observer: true,
      activeSlideKey: "1",
      pagination: {
        el: ".swiper-pagination",
        type: "progressbar",

        clickable: true
      },
      breakpoints: {
        2400: {
          slidesPerView: 14
        },
        1500: {
          slidesPerView: 11
        },
        1300: {
          slidesPerView: 8
        },
        1024: {
          slidesPerView: 7
        },
        768: {
          slidesPerView: 5
        },
        640: {
          slidesPerView: 4,
          spaceBetween: 10
        },
        320: {
          slidesPerView: 3,
          spaceBetween: 30
        }
      }
    };

    return (
      <Swiper {...params} shouldSwiperUpdate>
        {listFamousSerie.map(serie => {
          return (
            <div
              onClick={() => {
                state.setMovieSelected(serie.id);
                state.removeFamousSerie(serie.id);
              }}
              style={{
                // backgroundImage: `linear-gradient(white, blue),url(https://image.tmdb.org/t/p/w300${serie.poster})`,
                backgroundBlendMode: "color",
                marginRight: 10,
                marginTop: 10
              }}
              className="famous-serie"
              key={serie.id}
            >
              <img
                className="img-slide"
                src={`https://image.tmdb.org/t/p/w300${serie.poster}`}
                alt="img-famous-serie"
              />
            </div>
          );
        })}
      </Swiper>
    );
  })
);
