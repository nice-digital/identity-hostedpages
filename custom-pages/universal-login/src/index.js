/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router} from "react-router-dom";
import { Promise } from 'es6-promise'
import App from './components/App/App'

// if IE8
global.Promise = global.Promise || Promise;
global.__DEV__ = global.__DEV__ || document.location.host.indexOf('localhost') > -1;

const rootElement = document.getElementById("root");

ReactDOM.render(
  <App />,
  rootElement
);
