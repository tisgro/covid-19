import _ from "lodash";

const MIN_CASES = 50000;

const CASE_FACTORS = {
  denmark: 10,
  norway: 10,
  sweden: 100,
  germany: 100,
  lithuania: 10,
};

const DEATH_FACTORS = {
  denmark: 1,
  norway: 1,
  sweden: 10,
  germany: 10,
  lithuania: 1,
};

export const getCaseFactor = (country) =>
  CASE_FACTORS[_.lowerCase(country)] || 1000;

export const getDeathFactor = (country) =>
  DEATH_FACTORS[_.lowerCase(country)] || 100;

export const filterCountries = (filterCountry, country, totalCases) =>
  filterCountry
    ? _.upperCase(filterCountry) === _.upperCase(country)
    : totalCases > MIN_CASES;
