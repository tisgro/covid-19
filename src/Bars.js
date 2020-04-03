import _ from "lodash";
import React from "react";
import styled from "styled-components/macro";

const Bar = styled.div.attrs(props => ({
  title: props.datum,
  style: {
    height: Math.max(props.datum, 0) / props.factor + "px",
    background: `var(--data-color-${props.type}-default)`,
    borderBottom: `1px solid var(--data-color-${props.type}-secondary)`
  }
}))`
  height: 0px;
  width: 1px;
  margin-top: 4px;
  margin-left: 0px;
`;

const Bars = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  min-height: 20px;
`;

export default ({ data, type, factor = 100 }) => (
  <Bars>
    {_.map(data, (datum, i) => (
      <Bar key={i} datum={datum} type={type} factor={factor} />
    ))}
  </Bars>
);
