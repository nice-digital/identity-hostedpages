import React from 'react'
import PropTypes from 'prop-types'
import { Router } from 'react-router'

class AppContainer extends React.Component {
  static defaultProps = {
    routerKey: null,
  }
  static propTypes = {
    history: PropTypes.shape().isRequired,
    routes: PropTypes.shape().isRequired,
    routerKey: PropTypes.number,
  }

  render() {
    const { history, routes, routerKey } = this.props

    return (
      <div>
        <Router history={history} children={routes} key={routerKey} />
      </div>
    )
  }
}
export default AppContainer
