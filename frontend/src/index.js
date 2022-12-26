import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./Containers/App";
import reportWebVitals from "./reportWebVitals";
import {
  ApolloClient, InMemoryCache, ApolloProvider, HttpLink, split
} from '@apollo/client';
import { ChatProvider } from "./Hooks/useChat";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from 'apollo-utilities'
import { createClient } from 'graphql-ws';

// Create an http link:
const httpLink = new HttpLink({
  // uri: 'http://localhost:4000/'
  uri: 'http://localhost:4000/graphql',
})

const wsLink = new GraphQLWsLink(createClient({
  // url: 'ws://localhost:4000/subscriptions',
  url: 'ws://localhost:4000/graphql',
  options: {
    lazy: true,
  },
}))

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const splitLink = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  // uri: 'http://localhost:4000/',
  link: splitLink,
  cache: new InMemoryCache(),
})

console.log(client);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ChatProvider>
        <App /> 
      </ChatProvider>
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
