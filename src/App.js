import _ from "lodash";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import withData from "./withData";
import Heading from "./Heading";
import Table from "./Table";

const App = ({ data, dateRange, isLoading }) => (
  <Router>
    <Heading
      countries={_.map(data, "country")}
      dateRange={dateRange}
      isLoading={isLoading}
    />
    <Table data={data} dateRange={dateRange} isLoading={isLoading} />
  </Router>
);

export default withData()(App);
