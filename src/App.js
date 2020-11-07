import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import withData from "./withData";
import Table from "./Table";

const App = ({ data, dateRange, isLoading }) => (
  <Router>
    <Table data={data} dateRange={dateRange} isLoading={isLoading} />
  </Router>
);

export default withData()(App);
