import _ from "lodash";
import { parse } from "date-fns";
import React, { useState, useEffect } from "react";
import Papa from "papaparse";

// header row:
// Province/State,Country/Region,Lat,Long,1/22/20,1/23/20,1/24/20,1/25/20,1/26/20,1/27/20,1/28/20,1/29/20,1/30/20,1/31/20,2/1/20,2/2/20,2/3/20,2/4/20,2/5/20,2/6/20,2/7/20,2/8/20,2/9/20,2/10/20,2/11/20,2/12/20,2/13/20,2/14/20,2/15/20,2/16/20,2/17/20,2/18/20,2/19/20,2/20/20,2/21/20,2/22/20,2/23/20,2/24/20,2/25/20,2/26/20,2/27/20,2/28/20,2/29/20,3/1/20,3/2/20,3/3/20,3/4/20,3/5/20,3/6/20,3/7/20,3/8/20,3/9/20,3/10/20,3/11/20,3/12/20,3/13/20,3/14/20,3/15/20,3/16/20,3/17/20,3/18/20,3/19/20,3/20/20,3/21/20
const INDEX_REGION = 0;
const INDEX_COUNTRY = 1;
const INDEX_FIRST_DAY = 4;

const DATE_FORMAT = "M/d/yy";

const URL_CASES =
  "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

const URL_DEATHS =
  "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";

const getDeltas = data =>
  _.map(data, (datum, i) => (i === 0 ? datum : datum - data[i - 1]));

const zipSum = (objs, prop) =>
  _.zipWith(..._.map(objs, prop), (...args) => _.sum(args));

const fetchData = (url, setData, setError, setIsLoaded) =>
  fetch(url)
    .then(response => response.text())
    .then(rawData => setData(Papa.parse(rawData).data))
    .catch(error => setError(error.message))
    .finally(() => setIsLoaded(true));

const parseData = data =>
  _.chain(data)
    .slice(1)
    .map(row => {
      const dataPoints = _.chain(row)
        .slice(INDEX_FIRST_DAY)
        .map(_.parseInt)
        .value();

      return {
        country: row[INDEX_COUNTRY],
        region: row[INDEX_REGION],
        deltas: getDeltas(dataPoints),
        total: _.last(dataPoints)
      };
    })
    .reject(row => !row.country)
    .groupBy("country")
    .map((regions, country) => ({
      country,
      deltas: zipSum(regions, "deltas"),
      total: _.sumBy(regions, "total")
    }))
    .value();

export default () => WrappedComponent => props => {
  const [rawCases, setRawCases] = useState("");
  const [rawDeaths, setRawDeaths] = useState("");
  const [isLoadedCases, setIsLoadedCases] = useState(false);
  const [isLoadedDeaths, setIsLoadedDeaths] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    fetchData(URL_CASES, setRawCases, setError, setIsLoadedCases);
    fetchData(URL_DEATHS, setRawDeaths, setError, setIsLoadedDeaths);
  }, []); // only fetch on mount

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  if (!isLoadedCases || !isLoadedDeaths) {
    return "Loading...";
  }

  if (error) {
    return "Error: " + error;
  }

  const cases = parseData(rawCases);
  const deaths = parseData(rawDeaths);

  const data = _.map(cases, ({ country, deltas, total }) => ({
    country,
    newCases: deltas,
    totalCases: total,
    newDeaths: _.get(_.find(deaths, { country }), "deltas"),
    totalDeaths: _.get(_.find(deaths, { country }), "total")
  }));

  const dateRange = _.map(
    [rawCases[0][INDEX_FIRST_DAY], _.last(rawCases[0])],
    d => parse(d, DATE_FORMAT, new Date())
  );

  return <WrappedComponent data={data} dateRange={dateRange} {...props} />;
};
