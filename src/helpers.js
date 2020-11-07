import _ from "lodash";

const MIN_CASES = 10000;

const CASE_FACTORS = {
  denmark: 10,
  lithuania: 10,
};

const DEATH_FACTORS = {
  denmark: 1,
  lithuania: 1,
};

export const getCaseFactor = (country) =>
  CASE_FACTORS[_.lowerCase(country)] || 100;

export const getDeathFactor = (country) =>
  DEATH_FACTORS[_.lowerCase(country)] || 10;

export const filterCountries = (filterCountry, country, totalCases) =>
  filterCountry
    ? _.upperCase(filterCountry) === _.upperCase(country)
    : totalCases > MIN_CASES;
