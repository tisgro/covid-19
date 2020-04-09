import _ from "lodash";
import React, { useState } from "react";
import useMedia from "use-media";
import styled from "styled-components/macro";
import Heading from "./Heading";
import Bars from "./Bars";

const Table = styled.table`
  width: ${props => (props.isWide ? "auto" : "100%")};
  margin: 0 auto;
  border-spacing: 0;
`;

const Caption = styled.caption``;

const Head = styled.thead``;

const Body = styled.tbody`
  background: ${props => props.isSelected && `var(--background-highlight)`};
  transition: background-color 200ms;
`;

const Row = styled.tr`
  vertical-align: bottom;
`;

const Header = styled.th`
  font-weight: 300;
  font-size: 0.8em;
  text-transform: uppercase;
  text-align: ${props => props.align || "start"};
  border-bottom: 1px solid var(--border-color-default);
`;

const Cell = styled.td.attrs(props => ({
  rowSpan: props.rowSpan
}))`
  text-align: ${props => props.align || "start"};
  padding: 0;
  padding-left: ${props => (props.align === "end" ? "10px" : undefined)};
  color: ${props => props.type && `var(--data-color-${props.type}-default)`};
  border-bottom: ${props =>
    !props.isBorderless && "1px solid var(--border-color-default)"};
`;

const formatter = new Intl.NumberFormat("da-DK");

const CountryRow = ({
  isWide,
  country,
  newCases,
  newDeaths,
  totalCases,
  totalDeaths
}) => {
  const [isSelected, setIsSelected] = useState(false);

  const totalCasesFormatted = formatter.format(totalCases);
  const latestCasesFormatted = `+${formatter.format(_.last(newCases))}`;
  const casesBars = <Bars data={newCases} type="cases" isCompact={!isWide} />;
  const totalDeathsFormatted = formatter.format(totalDeaths);
  const latestDeathsFormatted = `+${formatter.format(_.last(newDeaths))}`;
  const deathsBars = (
    <Bars data={newDeaths} type="deaths" factor={10} isCompact={!isWide} />
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
          <Cell align="end" isBorderless>
            {casesBars}
          </Cell>
          <Cell align="end" isBorderless></Cell>
          <Cell align="end" type="deaths">
            {totalDeathsFormatted}
          </Cell>
          <Cell align="end" type="deaths">
            {latestDeathsFormatted}
          </Cell>
          <Cell align="end" isBorderless>
            {deathsBars}
          </Cell>
        </Row>
      ) : (
        <>
          <Row>
            <Cell rowSpan={2}>{country}</Cell>
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
            <Cell align="end" type="cases">
              {latestCasesFormatted}
            </Cell>
            <Cell align="end" type="deaths">
              {totalDeathsFormatted}
            </Cell>
            <Cell align="end" type="deaths">
              {latestDeathsFormatted}
            </Cell>
          </Row>
        </>
      )}
    </Body>
  );
};

export default ({ data, dateRange }) => {
  const isWide = useMedia({ minWidth: "700px" });

  return (
    <Table isWide={isWide}>
      <Caption>
        <Heading dateRange={dateRange} />
      </Caption>
      <Head>
        <Row>
          <Header>Country</Header>
          {isWide ? (
            <>
              <Header colSpan="3" align="end">
                Cases
              </Header>
              <Header align="end"></Header>
              <Header colSpan="3" align="end">
                Deaths
              </Header>
            </>
          ) : (
            <>
              <Header colSpan="2" align="end">
                Cases
              </Header>
              <Header colSpan="2" align="end">
                Deaths
              </Header>
            </>
          )}
        </Row>
      </Head>
      {_.chain(data)
        .filter(({ totalCases }) => totalCases > 600)
        .orderBy(["totalCases"], ["desc"])
        .map((countryData, i) => (
          <CountryRow key={i} {...{ isWide, ...countryData }} />
        ))
        .value()}
    </Table>
  );
};
