import { ApolloClient, InMemoryCache } from "@apollo/client";
import { adminSecret, uri } from "./.key";

export const client = new ApolloClient({
  uri: uri,
  headers: {
    "content-type": "application/json",
    "x-hasura-admin-secret": adminSecret,
  },
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

