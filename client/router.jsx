import React, {Component} from "react";
import { render } from "react-dom";
import { Router, Route, IndexRoute, Redirect, browserHistory } from "react-router";

import App from "./App.jsx";
import InscricaoMinicursos from "./InscricaoMinicursos.jsx";
import GerenciarMinicursos from "./GerenciarMinicursos.jsx";
import Administradores from "./Administradores.jsx";
import Login from "./Login.jsx";

Meteor.startup(()=>{
  render((
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={ InscricaoMinicursos } />
        <Route path="gerenciar" component={ GerenciarMinicursos }/>
        <Route path="admins" component={ Administradores }/>
        <Route path="login" component={ Login }/>
        <Redirect from="*" to="/" />
      </Route>
    </Router>
  ),document.getElementById("render-target"));
});
