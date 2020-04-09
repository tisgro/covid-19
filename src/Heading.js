import _ from "lodash";
import React from "react";
import { format } from "date-fns";
import styled from "styled-components/macro";

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color-default);
`;

const Title = styled.div`
  font-size: 1.5em;
  font-weight: 300;
`;

export default ({ dateRange }) => (
  <Header>
    <Title>COVID-19</Title>
    <div>
      {_.chain(dateRange)
        .map(d => format(d, "d MMM"))
        .join(" → ")
        .value()}
    </div>
  </Header>
);
