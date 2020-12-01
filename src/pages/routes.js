import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import StoreProvider from "../components/Store/Provider";
import UserStoreProvider from "../components/Store/Data/UserProvider";
import EntStoreProvider from "../components/Store/Data/EntProvider";
import RoutesPrivate from "../components/Routes/Private/Private";
import Home from "./Home/Home";
import Login from "./Login/Login";
import Services from "./Services/Services";
import Header from "./Header";
import Footer from "./Footer";
import AddEditService from "./Services/Add_Edit";
import "./routes.css";

import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider } from "@apollo/react-hooks";
import { client } from "../api";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {
  faCheckSquare,
  faEdit,
  faTrash,
  faCamera,
  faArrowLeft,
  faImages,
  faBus,
} from "@fortawesome/free-solid-svg-icons";
import LevelStoreProvider from "../components/Store/Data/LevelProvider";
import Enterprises from "./Enterprises/Enterprises";

library.add(
  fab,
  faCheckSquare,
  faEdit,
  faTrash,
  faCamera,
  faArrowLeft,
  faImages,
  faBus
);

const PagesRoute = () => (
  <Router>
    <ApolloProvider client={client}>
      <ApolloHooksProvider client={client}>
        <EntStoreProvider>
          <UserStoreProvider>
          <LevelStoreProvider>
            <StoreProvider>
              <Switch>
                <Route path="/login" component={Login} />
                <RoutesPrivate exact path="/" component={Home} />
                <RoutesPrivate exact path="/services/:id" component={Services} />
                <RoutesPrivate
                  exact
                  path="/services/addEdit/:type/:idService/:idEnt?"
                  component={AddEditService}
                />
                <RoutesPrivate
                  exact
                  path="/enterprises"
                  component={Enterprises}
                />
              </Switch>
            </StoreProvider>
          </LevelStoreProvider>
          </UserStoreProvider>
        </EntStoreProvider>
      </ApolloHooksProvider>
    </ApolloProvider>
  </Router>
);

export default PagesRoute;

/* 
<RoutesPrivate exact path="/services/addEdit/:idServ" component={() => <AddEditService id={5} />} />



import React, { useContext } from 'react';
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
