import React from "react";
import Routes from "./pages/routes";
import { BrowserRouter as Router } from "react-router-dom";

//import {ApolloClient, InMemoryCache, gql} from "apollo-boost";
import { client } from "./api";
import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider } from "@apollo/react-hooks";

function App() {
  return (
    <Router>
      <ApolloProvider client={client}>
        <ApolloHooksProvider client={client}>
          <Routes />
        </ApolloHooksProvider>
      </ApolloProvider>
    </Router>
  );
}

export default App;

/* function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}>
      <ApolloHooksProvider client={client}>
        <Services idEnt={idEnt} />
      </ApolloHooksProvider>
    </ApolloProvider>
      
    </div>
  );
} */
/* 
class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <ApolloHooksProvider client={client}>
          <Services idEnt="5" />
        </ApolloHooksProvider>
      </ApolloProvider>
    );
  }
}

export default App; */
