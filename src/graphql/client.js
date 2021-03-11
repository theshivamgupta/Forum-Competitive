import { ApolloClient, InMemoryCache } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";

const headers = { "x-hasura-admin-secret": "wizardking" };

const client = new ApolloClient({
  link: new WebSocketLink({
    uri: "wss://forum-competitive.herokuapp.com/v1/graphql",
    options: {
      reconnect: true,
      lazy: true,
      timeout: 3000,
      connectionParams: {
        headers,
      },
    },
  }),
  cache: new InMemoryCache(),
});

export default client;
