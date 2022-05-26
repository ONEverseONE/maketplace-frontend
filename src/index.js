import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from 'react-router-dom'
import ScrollToTop from './ScrollToTop';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { GRAPHQL_ENDPOINT } from './constant';

const client = new ApolloClient({
  uri: GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
});

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <BrowserRouter >
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </Web3ReactProvider>,
  document.getElementById('root')
);
