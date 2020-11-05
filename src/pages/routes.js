import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import history from "../history";
import StoreProvider from "../components/Store/Provider";
import RoutesPrivate from "../components/Routes/Private/Private";
import Home from "./Home/Home";
import Login from "./Login/Login";
import Services from "./Services/Services";

import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider } from "@apollo/react-hooks";
import { client } from "../api";

const PagesRoute = () => (
  <Router>
    <ApolloProvider client={client}>
      <ApolloHooksProvider client={client}>
        <StoreProvider>
          <Switch>
            <Route path="/login" component={Login} />
            <RoutesPrivate exact path="/" component={Home} />
            <RoutesPrivate exact path="/services" component={() => <Services idEnt={5} />} />
          </Switch>
        </StoreProvider>
      </ApolloHooksProvider>
    </ApolloProvider>
  </Router>
);

export default PagesRoute;

/* import React, { useContext } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import { Context } from './Context/AuthContext';

import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Services from './pages/Services/Services';

function CustomRoute({ isPrivate, ...rest }) {
  const { loading, authenticated } = useContext(Context);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  const token = localStorage.getItem('token');
  console.log(token);

  console.log(authenticated);

  if (isPrivate && !authenticated) {
    console.log('passa aqu');
    return <Redirect to="/login" />
  }

  return <Route {...rest} />;
}

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <CustomRoute exact path="/login" component={Login} />
        <CustomRoute isPrivate exact path="/" component={Home} />
        <CustomRoute isPrivate exact path="/services" component={Services} />
      </Switch>
    </BrowserRouter>
  );
} */
