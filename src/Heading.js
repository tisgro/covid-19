import _ from "lodash";
import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import styled from "styled-components/macro";
import Search from "./search";

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color-default);
`;

const Title = styled.div`
  margin-right: 10px;
  font-size: 1.5em;
  font-weight: 300;
`;

const DateRange = styled.div`
  flex-grow: 1;
  text-align: end;
`;

export default ({ countries, dateRange, isLoading }) => (
  <Header>
    <Title>
      <Link className="plain" to="/">
        COVID-19
      </Link>
    </Title>
    <Search
      options={countries}
      onSelect={(value) => {
        window.location = "/" + value;
      }}
    />
    <DateRange>
      {isLoading
        ? "Loading..."
        : _.chain([_.first(dateRange), _.last(dateRange)])
            .map((d) => format(d, "d MMM"))
            .join(" → ")
            .value()}
    </DateRange>
  </Header>
);
