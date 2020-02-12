import React, { useState } from "react";
import { AutoComplete } from "antd";

export function Complete({ setSearchedWords, resultsList, setMovieSelected }) {
  const onSearch = searchText => {
    setSearchedWords(searchText);
  };

  function onSelect(id) {
    console.log("onSelect", id);
    setMovieSelected(id);
    setValue("");
  }

  const options = resultsList.map(obj => ({ value: obj.id, text: obj.name }));

  const [value, setValue] = useState("");

  return (
    <div>
      <AutoComplete
        value={value}
        dataSource={options}
        style={{ width: 400 }}
        onSelect={onSelect}
        onSearch={onSearch}
        onChange={setValue}
        placeholder="control mode"
        allowClear={true}
        defaultActiveFirstOption={false}
        defaultOpen={false}
      />
    </div>
  );
}
