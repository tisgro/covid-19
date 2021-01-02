import _ from "lodash";
import React, { useState } from "react";
import { useRouteMatch, Link } from "react-router-dom";
import styled from "styled-components/macro";
import * as helpers from "./helpers";
import useBreakpoint from "./useBreakpoint";
import Bars from "./Bars";

const Table = styled.table`
  width: 100%;
  margin: 0 auto;
  border-spacing: 0;
`;

const Head = styled.thead``;

const Body = styled.tbody``;

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

const CountryRow = ({
  breakpoint,
  dateRange,
  filterCountry,
  country,
  newCases,
  newDeaths,
  totalCases,
  totalDeaths,
}) => {
  const totalCasesFormatted = helpers.formatNumber(totalCases);
  const latestCasesFormatted = `+${helpers.formatNumber(_.last(newCases))}`;
  const casesBars = (
    <Bars
      data={newCases}
      dateRange={dateRange}
      type="cases"
      height={filterCountry ? 300 : undefined}
      factor={helpers.getCaseFactor(filterCountry)}
      isCompact
    />
  );
  const totalDeathsFormatted = helpers.formatNumber(totalDeaths);
  const latestDeathsFormatted = `+${helpers.formatNumber(_.last(newDeaths))}`;
  const deathsBars = (
    <Bars
      data={newDeaths}
      dateRange={dateRange}
      type="deaths"
      height={filterCountry ? 100 : undefined}
      factor={helpers.getDeathFactor(filterCountry)}
      isCompact
    />
  );

  const countryLink = (
    <Link className="plain" to={`/${country}`}>
      {country}
    </Link>
  );

  return (
    <Body>
      {breakpoint === "wide" && (
        <Row>
          <Cell>{countryLink}</Cell>
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
              {countryLink}
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
              {countryLink}
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
            {...{ filterCountry, breakpoint, dateRange, ...countryData }}
          />
        ))
        .value()}
    </Table>
  );
};
