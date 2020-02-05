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

function timeConvert(minutes) {
  const daysCounter = Math.floor(minutes / 1440);
  const hoursCounter = Math.floor((minutes - daysCounter * 1440) / 60);
  const minutesCounter = Math.round(minutes % 60);

  const daysHourMinutes = { daysCounter, hoursCounter, minutesCounter };

  return daysHourMinutes;
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
      dataset: []
    };
  }

  setSearchedWords = name => {
    this.setState(
      {
        searchedWords: name
      },
      () => {
        if (name.length <= 2) return;

        const urlCall = mainUrl + `&query=${name}`;
        ky.get(urlCall)
          .json()
          .then(res => {
            // const filteredResults = res.results.map(singleRes => singleRes.title)
            // console.log(this.state.listMoviesSelected.map(d => d.title))
            this.setState({
              resultsList: res.results
            });
          });
      }
    );
  };

  resetResearchResults = () => {
    this.setState({
      resultsList: [],
      searchedWords: ""
    });
  };

  setDataset = (runtimeSigleMovie, title) => {
    const newNode = { value: runtimeSigleMovie, name: title };
    this.setState(prevState => ({
      dataset: [...prevState.dataset, newNode]
    }));
  };

  setMovieSelected = idMovieSelected => {
    const urlCall = `https://api.themoviedb.org/3/tv/${idMovieSelected}?api_key=085f025c352f6e30faea971db0667d31`;
    ky.get(urlCall)
      .json()
      .then(res => {
        const newMovie = res;
        const runtimeSigleMovie =
          res.episode_run_time[0] * res.number_of_episodes;
        const titleMovie = res.original_name;
        this.setDataset(runtimeSigleMovie, titleMovie);

        const addToCounter = this.state.counter + runtimeSigleMovie;

        this.setState(
          prevState => ({
            counter: addToCounter,
            listMoviesSelected: [...prevState.listMoviesSelected, newMovie]
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
      dataset
    } = this.state;

    const { daysCounter, hoursCounter, minutesCounter } = timeConvert(counter);

    return (
      <>
        {dataset.length > 0 ? (
          <DrawChart dataset={dataset} daysCounter={daysCounter} />
        ) : null}

        <div className="container">
          <div className="counter">
            <h1>{daysCounter} day </h1>
            <h1>{hoursCounter} hours </h1>
            <h1>{minutesCounter} minutes </h1>
          </div>

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

          <SingleMovie listMoviesSelected={listMoviesSelected} />
        </div>
      </>
    );
  }
}
