import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "../login";
import Home from "../home";
import ClinetProvider from "./clinetProvicer";

export default function Routes() {
  return (
    <ClinetProvider>
      <Router>
        <Switch>
          <Route path="/home">
            <Home />
          </Route>
          <Route>
            <Login />
          </Route>
        </Switch>
      </Router>
    </ClinetProvider>
  );
}
