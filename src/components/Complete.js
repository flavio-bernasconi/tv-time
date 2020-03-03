import React, { useState } from "react";
import { AutoComplete } from "antd";
import { observer, inject } from "mobx-react";

const visibleWidth = 320;
const hiddenWidth = 0;

export const Complete = inject("state")(
  observer(function Complete({ state }) {
    const onSearch = searchText => {
      state.setInputValue(searchText);
      state.getListMovie();
    };

    function onSelect(id) {
      state.setMovieSelected(id);
      setValue("");
    }

    const options = state.listResults.map(obj => ({
      value: obj.id,
      text: obj.name
    }));

    const [value, setValue] = useState("");
    console.log("complete btn", state.isVisible);

    return (
      <div style={{ display: "flex" }}>
        <AutoComplete
          value={value}
          dataSource={options}
          style={{
            width: state.isVisible ? visibleWidth : hiddenWidth
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
        <button
          onClick={() => state.setIsVisible(!state.isVisible)}
          className="btn-hide"
        >
          {state.isVisible ? "-" : "+"}
        </button>
      </div>
    );
  })
);
