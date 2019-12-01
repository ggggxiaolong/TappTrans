import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "../login";
import Home from "../home";
import ClinetProvider from "./clinetProvicer";
import { CookiesProvider } from "react-cookie";

export default function Routes() {
  return (
    <CookiesProvider>
      <ClinetProvider>
        <Router>
          <Switch>
            <Route path="/home" key="route_home">
              <Home />
            </Route>
            <Route key="route_login">
              <Login />
            </Route>
          </Switch>
        </Router>
      </ClinetProvider>
    </CookiesProvider>
  );
}
