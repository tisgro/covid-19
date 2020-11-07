import _ from "lodash";
import React, { useState } from "react";
import { useRouteMatch } from "react-router-dom";
import styled from "styled-components/macro";
import * as helpers from "./helpers";
import useBreakpoint from "./useBreakpoint";
import Heading from "./Heading";
import Bars from "./Bars";

const Table = styled.table`
  width: 100%;
  margin: 0 auto;
  border-spacing: 0;
`;

const Caption = styled.caption``;

const Head = styled.thead``;

const Body = styled.tbody`
  background: ${(props) => props.isSelected && `var(--background-highlight)`};
  transition: background-color 200ms;
`;

const Row = styled.tr`
  vertical-align: bottom;
`;

const Header = styled.th`
  font-weight: 300;
  font-size: 0.8em;
  text-transform: uppercase;
  text-align: ${(props) => props.align || "start"};
  border-bottom: 1px solid var(--border-color-default);
`;

const Cell = styled.td.attrs((props) => ({
  rowSpan: props.rowSpan,
  width: props.width,
}))`
  text-align: ${(props) => props.align || "start"};
  padding: 0;
  padding-left: ${(props) => (props.align === "end" ? "10px" : undefined)};
  color: ${(props) => props.type && `var(--data-color-${props.type}-default)`};
  border-bottom: ${(props) =>
    !props.isBorderless && "1px solid var(--border-color-default)"};
`;

const Sortable = styled.span`
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
`;

const formatter = new Intl.NumberFormat("da-DK");

const CountryRow = ({
  breakpoint,
  filterCountry,
  country,
  newCases,
  newDeaths,
  totalCases,
  totalDeaths,
}) => {
  const [isSelected, setIsSelected] = useState(false);

  const totalCasesFormatted = formatter.format(totalCases);
  const latestCasesFormatted = `+${formatter.format(_.last(newCases))}`;
  const casesBars = (
    <Bars
      data={newCases}
      type="cases"
      factor={helpers.getCaseFactor(filterCountry)}
      isCompact
    />
  );
  const totalDeathsFormatted = formatter.format(totalDeaths);
  const latestDeathsFormatted = `+${formatter.format(_.last(newDeaths))}`;
  const deathsBars = (
    <Bars
      data={newDeaths}
      type="deaths"
      factor={helpers.getDeathFactor(filterCountry)}
      isCompact
    />
  );

  return (
    <Body isSelected={isSelected} onClick={() => setIsSelected(!isSelected)}>
      {breakpoint === "wide" && (
        <Row>
          <Cell>{country}</Cell>
          <Cell align="end" type="cases">
            {totalCasesFormatted}
          </Cell>
          <Cell align="end" type="cases">
            {latestCasesFormatted}
          </Cell>
          <Cell align="end" width={1} isBorderless>
            {casesBars}
          </Cell>
          <Cell align="end" isBorderless></Cell>
          <Cell align="end" type="deaths">
            {totalDeathsFormatted}
          </Cell>
          <Cell align="end" type="deaths">
            {latestDeathsFormatted}
          </Cell>
          <Cell align="end" width={1} isBorderless>
            {deathsBars}
          </Cell>
        </Row>
      )}
      {breakpoint === "regular" && (
        <>
          <Row>
            <Cell colSpan={4} isBorderless>
              {country}
            </Cell>
          </Row>
          <Row>
            <Cell colSpan={2} align="end" isBorderless>
              {casesBars}
            </Cell>
            <Cell colSpan={2} align="end" isBorderless>
              {deathsBars}
            </Cell>
          </Row>
          <Row>
            <Cell align="end" type="cases">
              {totalCasesFormatted}
            </Cell>
            <Cell align="end" type="cases" width={1}>
              {latestCasesFormatted}
            </Cell>
            <Cell align="end" type="deaths">
              {totalDeathsFormatted}
            </Cell>
            <Cell align="end" type="deaths" width={1}>
              {latestDeathsFormatted}
            </Cell>
          </Row>
        </>
      )}
      {breakpoint === "narrow" && (
        <>
          <Row>
            <Cell colSpan={2} isBorderless>
              {country}
            </Cell>
          </Row>
          <Row>
            <Cell colSpan={2} align="end" isBorderless>
              {casesBars}
            </Cell>
          </Row>
          <Row>
            <Cell align="end" type="cases" isBorderless>
              {totalCasesFormatted}
            </Cell>
            <Cell align="end" type="cases" isBorderless width={1}>
              {latestCasesFormatted}
            </Cell>
          </Row>
          <Row>
            <Cell colSpan={2} align="end" isBorderless>
              {deathsBars}
            </Cell>
          </Row>
          <Row>
            <Cell align="end" type="deaths">
              {totalDeathsFormatted}
            </Cell>
            <Cell align="end" type="deaths" width={1}>
              {latestDeathsFormatted}
            </Cell>
          </Row>
        </>
      )}
    </Body>
  );
};

export default ({ data, dateRange, isLoading }) => {
  const routeMatch = useRouteMatch("/:country");
  const filterCountry = routeMatch?.params.country;

  const breakpoint = useBreakpoint();
  const [sortKey, setSortKey] = useState("totalCases");

  const casesHeader = (
    <Sortable onClick={() => setSortKey("totalCases")}>
      {sortKey === "totalCases" && "↓"} Cases
    </Sortable>
  );

  const deathsHeader = (
    <Sortable onClick={() => setSortKey("totalDeaths")}>
      {sortKey === "totalDeaths" && "↓"} Deaths
    </Sortable>
  );

  return (
    <Table>
      <Caption>
        <Heading dateRange={dateRange} isLoading={isLoading} />
      </Caption>
      {_.size(data) > 0 && (
        <Head>
          <Row>
            {breakpoint === "wide" && (
              <>
                <Header>Country</Header>
                <Header colSpan="3" align="end">
                  {casesHeader}
                </Header>
                <Header align="end"></Header>
                <Header colSpan="3" align="end">
                  {deathsHeader}
                </Header>
              </>
            )}
            {breakpoint === "regular" && (
              <>
                <Header colSpan="2" align="end">
                  {casesHeader}
                </Header>
                <Header colSpan="2" align="end">
                  {deathsHeader}
                </Header>
              </>
            )}
            {breakpoint === "narrow" && (
              <>
                <Header colSpan="2" align="end">
                  {casesHeader} / {deathsHeader}
                </Header>
              </>
            )}
          </Row>
        </Head>
      )}
      {_.chain(data)
        .filter(({ country, totalCases }) =>
          helpers.filterCountries(filterCountry, country, totalCases)
        )
        .orderBy([sortKey], ["desc"])
        .map((countryData, i) => (
          <CountryRow
            key={i}
            {...{ filterCountry, breakpoint, ...countryData }}
          />
        ))
        .value()}
    </Table>
  );
};
