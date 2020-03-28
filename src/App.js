import React from "react";
import withData from "./withData";
import Table from "./Table";

const App = ({ data }) => <Table data={data} />;

export default withData()(App);
