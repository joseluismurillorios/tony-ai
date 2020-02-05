import React from 'react';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createHashHistory } from 'history';

import store from './core/redux/store';
import Layout from './core/layout';
import Routes from './core/routes';

const history = createHashHistory();

const Root = () => (
  <Provider store={store}>
    <Router history={history}>
      <Layout>
        <Routes />
      </Layout>
    </Router>
  </Provider>
);

export default Root;
