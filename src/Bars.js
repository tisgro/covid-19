import _ from "lodash";
import React from "react";
import styled from "styled-components/macro";

const Bar = styled.div.attrs(props => ({
  title: props.datum,
  style: {
    height: Math.max(props.datum, 0) / props.factor + "px",
    background: `var(--data-color-${props.type}-default)`
  }
}))`
  height: 0px;
  width: 1px;
  margin-top: 4px;
  margin-left: ${props => (props.isCompact ? "0px" : "1px")};
`;

const Bars = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  min-height: 20px;
  border-bottom: 1px solid
    ${props => `var(--data-color-${props.type}-secondary)`};
`;

export default ({ data, type, factor = 100, isCompact }) => (
  <Bars type={type}>
    {_.map(data, (datum, i) => (
      <Bar
        key={i}
        datum={datum}
        type={type}
        factor={factor}
        isCompact={isCompact}
      />
    ))}
  </Bars>
);
