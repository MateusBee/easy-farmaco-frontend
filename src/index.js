import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Router, Route, Switch, Redirect, withRouter } from "react-router-dom";

import { SnackbarProvider } from 'notistack';

import { MuiThemeProvider } from '@material-ui/core/styles';

// core components
import { history } from "config/history";
import Structure from "Layout/Layout.js";
import LoginPage from 'views/Login/Login.js'
import PasswordPage from 'views/Password/Password.js'

import { mui } from 'assets/jss/theme.js'

import "assets/css/material-dashboard-react.css?v=1.10.0";

const Routes = withRouter(function Routes() {
  const token = localStorage.getItem("jwtToken");
  return token ? valid : invalid;
});

const valid = <Switch>
  <Route path="/easy-farmaco" component={Structure} />
  <Route path="/auth/login" component={LoginPage} />
  <Redirect from="/" to="/easy-farmaco/horarios" />
</Switch>;

const invalid = <Switch>
  <Route path="/auth/login" component={LoginPage} />
  <Route path="/auth/password" component={PasswordPage} />
  <Redirect from="/" to="/auth/login" />
</Switch>;


ReactDOM.render(
  <MuiThemeProvider theme={mui}>
    <SnackbarProvider maxSnack={3}>
      <Router history={history}>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </Router>
    </SnackbarProvider>
  </MuiThemeProvider>,
  document.getElementById("root")
);
