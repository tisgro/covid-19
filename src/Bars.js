import _ from "lodash";
import React from "react";
import { BarCanvas as Bar } from "@nivo/bar";
import { format } from "date-fns";
import * as helpers from "./helpers";

export default ({ data, dateRange, type, height, factor = 1000 }) => {
  const barData = _.map(data, (d, i) => ({
    id: i,
    value: Math.max(d, 0),
  }));
  const barHeight = height || _.ceil(_.max(data) / factor);
  const documentStyle = window.getComputedStyle(document.documentElement);
  const dataColor = documentStyle.getPropertyValue(
    `--data-color-${type}-default`
  );
  const gridColor = documentStyle.getPropertyValue(
    `--data-color-${type}-secondary`
  );

  return (
    <Bar
      width={_.size(data)}
      height={barHeight}
      data={barData}
      indexBy="id"
      keys={["value"]}
      colors={dataColor}
      padding={0}
      margin={{ top: 4, right: 0, bottom: 1, left: 0 }}
      enableGridX={false}
      enableGridY={true}
      gridYValues={[0]}
      enableLabel={false}
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
      tooltip={({ index, value, color }) => (
        <span style={{ color }}>
          {format(dateRange[index], "d MMM")}: {helpers.formatNumber(value)}
        </span>
      )}
    />
  );
};
