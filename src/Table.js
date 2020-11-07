import _ from "lodash";
import React, { useState } from "react";
import useMedia from "use-media";
import styled from "styled-components/macro";
import Heading from "./Heading";
import Bars from "./Bars";

const MIN_CASES = 10000;
const WIDE_BREAKPOINT = "1000px";

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
  isWide,
  country,
  newCases,
  newDeaths,
  totalCases,
  totalDeaths,
}) => {
  const [isSelected, setIsSelected] = useState(false);

  const totalCasesFormatted = formatter.format(totalCases);
  const latestCasesFormatted = `+${formatter.format(_.last(newCases))}`;
  const casesBars = <Bars data={newCases} type="cases" isCompact />;
  const totalDeathsFormatted = formatter.format(totalDeaths);
  const latestDeathsFormatted = `+${formatter.format(_.last(newDeaths))}`;
  const deathsBars = (
    <Bars data={newDeaths} type="deaths" factor={10} isCompact />
  );

  return (
    <Body isSelected={isSelected} onClick={() => setIsSelected(!isSelected)}>
      {isWide ? (
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
      ) : (
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
    </Body>
  );
};

export default ({ data, dateRange, isLoading }) => {
  const isWide = useMedia({ minWidth: WIDE_BREAKPOINT });
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
    <Table isWide={isWide}>
      <Caption>
        <Heading dateRange={dateRange} isLoading={isLoading} />
      </Caption>
      {_.size(data) > 0 && (
        <Head>
          <Row>
            {isWide ? (
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
            ) : (
              <>
                <Header colSpan="2" align="end">
                  {casesHeader}
                </Header>
                <Header colSpan="2" align="end">
                  {deathsHeader}
                </Header>
              </>
            )}
          </Row>
        </Head>
      )}
      {_.chain(data)
        .filter(({ totalCases }) => totalCases > MIN_CASES)
        .orderBy([sortKey], ["desc"])
        .map((countryData, i) => (
          <CountryRow key={i} {...{ isWide, ...countryData }} />
        ))
        .value()}
    </Table>
  );
};
