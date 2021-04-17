import _ from "lodash";
import React from "react";
import { ResponsiveLineCanvas as Line } from "@nivo/line";
import styled from "styled-components/macro";
import { format } from "date-fns";
import * as helpers from "./helpers";

const Tooltip = styled.div`
  padding: 2px 8px;
  border: 1px solid var(--border-color-default);
  background: var(--background-default);
`;

export default ({ data, dateRange, type, height, factor = 1000 }) => {
  const lineData = _.map(data, (d, i) => ({
    x: i,
    y: Math.max(d, 0),
  }));
  const lineHeight = height || _.ceil(_.max(data) / factor);
  const documentStyle = window.getComputedStyle(document.documentElement);
  const dataColor = documentStyle.getPropertyValue(
    `--data-color-${type}-default`
  );
  const gridColor = documentStyle.getPropertyValue(
    `--data-color-${type}-secondary`
  );

  return (
    <div style={{ width: "100%", height: lineHeight }}>
      <Line
        data={[{ id: 0, data: lineData }]}
        curve="step"
        lineWidth={0.5}
        colors={dataColor}
        padding={0}
        margin={{ top: 4, right: 0, bottom: 1, left: 0 }}
        enableGridX={false}
        enableGridY={true}
        gridYValues={[0]}
        enableLabel={false}
        enablePoints={false}
        enableArea={true}
        areaOpacity={1}
        axisTop={null}
        axisBottom={null}
        axisLeft={null}
        axisRight={null}
        animate={false}
        theme={{
          grid: {
            line: {
              stroke: gridColor,
              strokeWidth: 1,
            },
          },
        }}
        tooltip={({ point }) => (
          <Tooltip style={{ color: point.color }}>
            {format(dateRange[point.index], "d MMM")}:{" "}
            {helpers.formatNumber(point.data.y)}
          </Tooltip>
        )}
      />
    </div>
  );
};
