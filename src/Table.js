import _ from "lodash";
import React from "react";
import styled from "styled-components/macro";
import Bars from "./Bars";

const Region = styled.span`
  margin-left: 4px;
  font-size: 0.8em;
  color: var(--text-secondary);
`;

const Table = styled.table`
  width: 100%;
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
  text-align: ${props => props.align || "start"};
  border-bottom: 1px solid var(--border-color-default);
`;

const Cell = styled.td.attrs(props => ({
  rowSpan: props.rowSpan
}))`
  text-align: ${props => props.align || "start"};
  padding: 0;
  padding-left: ${props => (props.align === "end" ? "10px" : undefined)};
  color: ${props => props.type && `var(--data-color-${props.type})`};

  border-bottom: 1px solid
    ${props =>
      props.isBorderSecondary
        ? "var(--border-color-secondary)"
        : "var(--border-color-default)"};
`;

const formatter = new Intl.NumberFormat("da-DK");

export default ({ data }) => (
  <Table>
    <Head>
      <Row>
        <Header>Country</Header>
        <Header align="end">Total</Header>
        <Header align="end">Today</Header>
        <Header align="center">Per Day</Header>
      </Row>
    </Head>
    <Body>
      {_.chain(data)
        .orderBy(["totalCases"], ["desc"])
        .map(
          (
            { country, region, newCases, newDeaths, totalCases, totalDeaths },
            i
          ) => (
            <>
              <Row>
                <Cell rowSpan={2}>
                  {country}
                  {region && region !== country && <Region>{region}</Region>}
                </Cell>
                <Cell align="end" type="cases" isBorderSecondary>
                  {formatter.format(totalCases)}
                </Cell>
                <Cell align="end" type="cases" isBorderSecondary>
                  +{formatter.format(_.last(newCases))}
                </Cell>
                <Cell align="end" isBorderSecondary>
                  <Bars data={newCases} type="cases" />
                </Cell>
              </Row>
              <Row>
                <Cell align="end" type="deaths">
                  {formatter.format(totalDeaths)}
                </Cell>
                <Cell align="end" type="deaths">
                  +{formatter.format(_.last(newDeaths))}
                </Cell>
                <Cell align="end">
                  <Bars data={newDeaths} type="deaths" factor={10} />
                </Cell>
              </Row>
            </>
          )
        )
        .value()}
    </Body>
  </Table>
);
