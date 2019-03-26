/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import React from 'react'
import ReactDOM from 'react-dom'
import createHashHistory from 'history/lib/createHashHistory'
import { useRouterHistory } from 'react-router'
import { Promise } from 'es6-promise'
import AppContainer from './containers/AppContainer'

// if IE8
global.Promise = global.Promise || Promise
global.__DEV__ = global.__DEV__ || document.location.host.indexOf('localhost') > -1

// ========================================================
// Browser History Setup
// ========================================================
const history = useRouterHistory(createHashHistory)({
  basename: __BASENAME__
})

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('container')

let render = (routerKey = null) => {
  const routes = require('./routes/index').default()

  ReactDOM.render(
    <AppContainer history={history} routes={routes} routerKey={routerKey} />,
    MOUNT_NODE
  )
}

// Enable HMR and catch runtime errors in RedBox
// This code is excluded from production bundle
if (__DEV__) {
  if (module.hot) {
    // Development render functions
    const renderApp = render
    const renderError = (error) => {
      const RedBox = require('redbox-react').default

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
    }

    // Wrap render in try/catch
    render = () => {
      try {
        renderApp()
      } catch (error) {
        renderError(error)
      }
    }

    // Setup hot module replacement
    module.hot.accept('./routes/index', () =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE)
        render()
      }))
  }
}

// ========================================================
// Go!
// ========================================================
render()
