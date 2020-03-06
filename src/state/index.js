import { types as t } from "mobx-state-tree";
import ky from "ky";

const mainUrl =
  "https://api.themoviedb.org/3/search/tv?api_key=085f025c352f6e30faea971db0667d31";

function apiCallGetMoviesContain(partialName) {
  const urlCall = mainUrl + `&query=${partialName}`;
  return ky.get(urlCall).json();
}

export const State = t
  .model("State", {
    searchedWords: t.optional(t.string, ""),
    listResults: t.optional(t.array(t.frozen()), []),
    listMovieSelected: t.optional(t.array(t.frozen()), []),
    dataset: t.optional(t.array(t.frozen()), []),
    isChartVisible: t.optional(t.boolean, false),
    isInputOpen: t.optional(t.boolean, true),
    listFamousSerie: t.optional(t.array(t.frozen()), [])
  })
  .actions(self => ({
    setInputValue(value) {
      self.searchedWords = value;
    },
    setList(value) {
      self.listResults = value;
    },
    getListMovie() {
      apiCallGetMoviesContain(self.partialSearch)
        .then(res => {
          self.setList(res.results);
        })
        .catch(err => console.log(err));
    },

    addToDataset(movie, runtimeSigleMovie) {
      const infoPointOnChart = {
        value: runtimeSigleMovie,
        name: movie.name,
        id: movie.id
      };
      self.dataset = [...self.dataset, infoPointOnChart];
    },
    addToListSelected(movie) {
      self.listMovieSelected = [...self.listMovieSelected, movie];
    },
    setMovieSelected(id) {
      const urlCall = `https://api.themoviedb.org/3/tv/${id}?api_key=085f025c352f6e30faea971db0667d31`;
      ky.get(urlCall)
        .json()
        .then(movieDetails => {
          const runtimeSigleMovie =
            movieDetails.episode_run_time[0] * movieDetails.number_of_episodes;
          self.addToDataset(movieDetails, runtimeSigleMovie);
          self.addToListSelected(movieDetails);
        })
        .catch(err => console.log(err));
    },
    deleteMovie(movie) {
      const listMoviesSelectedLessMovieToDelete = self.listMovieSelected.filter(
        d => d.id !== movie.id
      );

      const datasetLessMovieToDelete = self.dataset.filter(
        d => d.id !== movie.id
      );

      self.listMovieSelected = listMoviesSelectedLessMovieToDelete;
      self.dataset = datasetLessMovieToDelete;
    },
    setIsChartVisible() {
      self.isChartVisible = !self.isChartVisible;
    },
    setIsInputOpen(val) {
      self.isInputOpen = val;
    },
    addToFamousSerie(movies) {
      self.listFamousSerie = movies;
    },
    getIdFamousSerie() {
      const urlCall = `https://api.themoviedb.org/3/tv/top_rated?api_key=085f025c352f6e30faea971db0667d31
      `;
      ky.get(urlCall)
        .json()
        .then(res => {
          const movies = res.results.map(movie => {
            return { id: movie.id, poster: movie.poster_path };
          });
          self.addToFamousSerie(movies);
        });
      console.log("call famous");
    },
    refreshListFamous(filteredList) {
      self.listFamousSerie = filteredList;
    },
    removeFamousSerie(id) {
      self.refreshListFamous(
        self.listFamousSerie.filter(serie => serie.id !== id)
      );
    }
  })) //end action
  .views(self => ({
    get partialSearch() {
      return self.searchedWords;
    },
    get counter() {
      const getDuration = movie =>
        movie.episode_run_time[0] * movie.number_of_episodes;

      const totalDuration = self.listMovieSelected
        .map(getDuration)
        .reduce((acc, val) => acc + val, 0);

      return totalDuration;
    }
  }));
