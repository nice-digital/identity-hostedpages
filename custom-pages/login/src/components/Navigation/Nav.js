import React from 'react'
// import PropTypes from 'prop-types'
import { IndexLink, Link } from 'react-router'
import classes from './Nav.scss'

export const Navigation = () => (
  <div className={`${classes.navigation}`}>
    <IndexLink to="/" activeClassName={classes.activeRoute}>
      Login
    </IndexLink>
    {'  ·  '}
    <Link to="/register" activeClassName={classes.activeRoute}>
      Register
    </Link>
  </div>
)

// Navigation.propTypes = {
//   children: PropTypes.element.isRequired
// }

export default Navigation
