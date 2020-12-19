import _ from "lodash";
import React, { useState } from "react";
import styled from "styled-components/macro";

const Search = styled.div`
  position: relative;
`;

const SearchInput = styled.input.attrs((props) => ({
  type: "text",
}))`
  width: 8em;
  padding: 0px 5px;
  background: transparent;
  appearance: none;
  font-size: inherit;
  line-height: inherit;
  border: 1px solid transparent;
  border-radius: 5px;
  color: var(--text-default);
  cursor: pointer;

  &:focus,
  &:hover {
    border-color: var(--border-color-default);
    outline: none;
    cursor: initial;
  }

  &::placeholder {
    color: var(--text-secondary);
    font-size: inherit;
    line-height: inherit;
  }
`;

const Results = styled.div`
  position: absolute;
  z-index: 1; // raise above charts
  box-sizing: border-box;
  width: 100%;
  border: 1px solid var(--border-color-default);
  border-radius: 5px;
  padding: 5px 0px;
  background: var(--background-default);
`;

const Result = styled.div`
  padding: 5px 10px;
  cursor: pointer;
`;

export default ({ options, onSelect }) => {
  const [filter, setFilter] = useState();
  const results =
    filter &&
    _.filter(options, (option) =>
      _.startsWith(_.toUpper(option), _.toUpper(filter))
    );

  return (
    <Search>
      <SearchInput
        placeholder="🔍"
        onBlur={(e) => {
          const { target } = e;
          setTimeout(() => {
            target.value = "";
            setFilter("");
          }, 10);
        }}
        onKeyUp={(e) => {
          setFilter(e.target.value);
        }}
      />
      {_.size(results) > 0 && (
        <Results>
          {_.map(results, (result) => (
            <Result key={result} onClick={() => onSelect(result)}>
              {result}
            </Result>
          ))}
        </Results>
      )}
    </Search>
  );
};
