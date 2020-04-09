import React from "react";
import withData from "./withData";
import Table from "./Table";

const App = ({ data, dateRange }) => (
  <Table data={data} dateRange={dateRange} />
);

export default withData()(App);
