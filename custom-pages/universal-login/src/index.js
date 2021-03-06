/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import { Promise } from 'es6-promise';

import '@nice-digital/design-system/scss/base.scss';
import App from './components/App/App';

global.Promise = global.Promise || Promise;
global.__DEV__ = global.__DEV__ || document.location.host.indexOf('localhost') > -1;

const rootElement = document.getElementById("root");

ReactDOM.render( <App />, rootElement );
