import React from "react";

export const Inputsearch = props => {
  const { setSearchedWords, searchedWords } = props;

  return (
    <div>
      <input
        placeholder="Search TV serie"
        className="input-research"
        value={searchedWords}
        onChange={e => setSearchedWords(e.target.value)}
      ></input>
    </div>
  );
};
