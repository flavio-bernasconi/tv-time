import React from "react";
import "./App.css";
import { Inputsearch } from "./components/Inputsearch";
import ky from "ky";
import { ResearchResults } from "./components/ResearchResults";
import { SingleMovie } from "./components/SingleMovie";
import { DrawChart } from "./components/DrawChart";

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

function timeConvert(minutes, hoursOfSleep) {
  console.log(hoursOfSleep);
  const daysCounter = Math.floor(minutes / (1440 - hoursOfSleep));
  const hoursCounter = Math.floor(
    (minutes - daysCounter * (1440 - hoursOfSleep)) / 60
  );
  const minutesCounter = Math.round(minutes % 60);

  const daysHourMinutes = { daysCounter, hoursCounter, minutesCounter };

  return daysHourMinutes;
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
      daysCounter: 0,
      hoursCounter: 0,
      minutesCounter: 0,
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
          this.setState({
            resultsList: res.results
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
        timeConvert(
          getTotalDuration(this.state.listMoviesSelected),
          this.state.hoursOfSleep
        );
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
        const newMovie = movieDetails;
        const runtimeSigleMovie =
          movieDetails.episode_run_time[0] * movieDetails.number_of_episodes;
        const titleMovie = movieDetails.original_name;

        const infoPointOnChart = {
          value: runtimeSigleMovie,
          name: titleMovie,
          id: movieDetails.id
        };

        this.setState(
          prevState => ({
            counter: this.state.counter + runtimeSigleMovie,
            listMoviesSelected: [...prevState.listMoviesSelected, newMovie],
            dataset: [...prevState.dataset, infoPointOnChart]
          }),
          () => {
            timeConvert(
              getTotalDuration(
                this.state.listMoviesSelected,
                this.state.hoursOfSleep
              )
            );
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

    const { daysCounter, hoursCounter, minutesCounter } = timeConvert(
      counter,
      hoursOfSleep
    );

    return (
      <>
        <DrawChart
          dataset={dataset}
          counter={counter}
          hoursOfSleep={hoursOfSleep}
        />

        <div className="container">
          <div className="counter">
            <h1>{daysCounter} day </h1>
            <h1>{hoursCounter} hours </h1>
            <h1>{minutesCounter} minutes </h1>
          </div>

          <input
            type="number"
            onChange={e =>
              this.setState({
                hoursOfSleep: e.target.value * 60
              })
            }
          />

          <Inputsearch
            setSearchedWords={setSearchedWords}
            searchedWords={searchedWords}
          />
          {searchedWords.length > 2 ? (
            <ResearchResults
              resultsList={resultsList}
              setMovieSelected={setMovieSelected}
              resetResearchResults={resetResearchResults}
            />
          ) : null}

          <SingleMovie
            deleteMovie={this.deleteMovie}
            listMoviesSelected={listMoviesSelected}
          />
        </div>
      </>
    );
  }
}
