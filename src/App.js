import React from "react";
import "./App.css";
import { Inputsearch } from "./components/Inputsearch";
import ky from "ky";
import { ResearchResults } from "./components/ResearchResults";
import { SingleMovie } from "./components/SingleMovie";
import { DrawChart } from "./components/DrawChart";
import { timeConvert } from "./components/utils";
import _ from "lodash";
import { Complete } from "./components/Complete";

const mainUrl =
  "https://api.themoviedb.org/3/search/tv?api_key=085f025c352f6e30faea971db0667d31";

function getTotalDuration(list) {
  const getDuration = movie =>
    movie.episode_run_time[0] * movie.number_of_episodes;
  const totalDuration = list
    .map(getDuration)
    .reduce((acc, val) => acc + val, 0);

  return totalDuration;
}

function apiCallGetMoviesContain(partialName) {
  const urlCall = mainUrl + `&query=${partialName}`;
  return ky.get(urlCall).json();
}

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchedWords: "",
      resultsList: [],
      listMoviesSelected: [],
      currentMovie: {},
      counter: 0,
      dataset: [],
      hoursOfSleep: 0
    };
  }

  setSearchedWords = partialName => {
    this.setState(
      {
        searchedWords: partialName
      },
      () => {
        if (partialName.length <= 2) return;

        apiCallGetMoviesContain(partialName).then(res => {
          const nameAlreadySelected = this.state.listMoviesSelected.map(
            d => d.name
          );
          const listNames = res.results.map(d => d.name);

          const found = listNames.filter(x => nameAlreadySelected.includes(x));

          const filter = res.results.filter(d => !found.includes(d.name));

          this.setState({
            resultsList: filter
          });
        });
      }
    );
  };

  deleteMovie = movieToDelete => {
    const listMoviesSelectedLessMovieToDelete = this.state.listMoviesSelected.filter(
      d => d.id !== movieToDelete.id
    );

    const datasetLessMovieToDelete = this.state.dataset.filter(
      d => d.id !== movieToDelete.id
    );

    const runtimeSigleMovie =
      movieToDelete.episode_run_time[0] * movieToDelete.number_of_episodes;

    this.setState(
      {
        listMoviesSelected: listMoviesSelectedLessMovieToDelete,
        dataset: datasetLessMovieToDelete,
        counter: this.state.counter - runtimeSigleMovie
      },
      () => {
        timeConvert(getTotalDuration(this.state.listMoviesSelected));
      }
    );
  };

  resetResearchResults = () => {
    this.setState({
      resultsList: [],
      searchedWords: ""
    });
  };

  setMovieSelected = idMovieSelected => {
    const urlCall = `https://api.themoviedb.org/3/tv/${idMovieSelected}?api_key=085f025c352f6e30faea971db0667d31`;
    ky.get(urlCall)
      .json()
      .then(movieDetails => {
        if (this.state.listMoviesSelected.includes(movieDetails.name)) {
          console.log("erroeoreoroeo");
        }

        if (
          !movieDetails.episode_run_time[0] ||
          !movieDetails.number_of_episodes
        ) {
          movieDetails.episode_run_time[0] = 0;
          movieDetails.number_of_episodes = 0;
        }

        const runtimeSigleMovie =
          movieDetails.episode_run_time[0] * movieDetails.number_of_episodes;
        const titleMovie = movieDetails.name;

        const infoPointOnChart = {
          value: runtimeSigleMovie,
          name: titleMovie,
          id: movieDetails.id
        };

        this.setState(
          prevState => ({
            counter: this.state.counter + runtimeSigleMovie,
            listMoviesSelected: [...prevState.listMoviesSelected, movieDetails],
            dataset: [...prevState.dataset, infoPointOnChart]
          }),
          () => {
            timeConvert(getTotalDuration(this.state.listMoviesSelected));
          }
        );
      });
  };

  render() {
    const { setSearchedWords, setMovieSelected, resetResearchResults } = this;
    const {
      resultsList,
      searchedWords,
      listMoviesSelected,
      counter,
      dataset,
      hoursOfSleep
    } = this.state;

    const {
      monthsCounter,
      daysCounter,
      hoursCounter,
      minutesCounter
    } = timeConvert(counter);

    return (
      <>
        <DrawChart
          dataset={dataset}
          counter={counter}
          hoursOfSleep={hoursOfSleep}
        />

        <div className="container">
          <div className="counter">
            <h1>{monthsCounter} mon </h1>
            <h1>{daysCounter} day </h1>
            <h1>{hoursCounter} hours </h1>
            <h1>{minutesCounter} minutes </h1>
          </div>

          <Complete
            resultsList={resultsList}
            setSearchedWords={setSearchedWords}
            searchedWords={searchedWords}
            setMovieSelected={setMovieSelected}
          />

          {/* <Inputsearch
            setSearchedWords={setSearchedWords}
            searchedWords={searchedWords}
            resultsList={resultsList}
          />
          {searchedWords.length > 2 ? (
            <ResearchResults
              resultsList={resultsList}
              setMovieSelected={setMovieSelected}
              resetResearchResults={resetResearchResults}
            />
          ) : null} */}

          {console.log(resultsList)}

          <SingleMovie
            deleteMovie={this.deleteMovie}
            listMoviesSelected={listMoviesSelected}
          />
        </div>
      </>
    );
  }
}
