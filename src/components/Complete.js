import React, { useState } from "react";
import { AutoComplete } from "antd";
import { observer, inject } from "mobx-react";

const visibleWidth = 320;
const hiddenWidth = 0;

export const Complete = inject("state")(
  observer(function Complete({ state }) {
    const {
      setInputValue,
      getListMovie,
      setMovieSelected,
      listResults,
      isInputOpen,
      setIsInputOpen,
      isChartVisible
    } = state;

    const onSearch = searchText => {
      setInputValue(searchText);
      getListMovie();
    };

    function onSelect(id) {
      setMovieSelected(id);
      setValue("");
    }

    const options = listResults.map(obj => ({
      value: obj.id,
      text: obj.name
    }));

    const [value, setValue] = useState("");

    return (
      <div style={{ display: "flex" }}>
        <AutoComplete
          value={value}
          dataSource={options}
          style={{
            width: isInputOpen ? visibleWidth : hiddenWidth
          }}
          onSelect={onSelect}
          onSearch={onSearch}
          onChange={setValue}
          placeholder="Search a TV show"
          allowClear={true}
          defaultActiveFirstOption={false}
          defaultOpen={false}
          filterOption={false}
        />
        {isChartVisible && (
          <button
            onClick={() => setIsInputOpen(!isInputOpen)}
            className="btn-hide"
          >
            {isInputOpen ? "-" : "+"}
          </button>
        )}
      </div>
    );
  })
);
