import React from "react";
import withData from "./withData";
import Table from "./Table";

const App = ({ data, dateRange, isLoading }) => (
  <Table data={data} dateRange={dateRange} isLoading={isLoading} />
);

export default withData()(App);
