import React from 'react'
// import PropTypes from 'prop-types'
import { IndexLink, Link } from 'react-router'
import './Nav.scss'

export const Navigation = () => {
  const register = window.location.href.indexOf('register') !== -1
  return (
    <div className="navigation">
      {register ? (
        <div className="navigationLink">
          <h3> Register </h3>
          <span>Already have an NICE Account?</span>
          <IndexLink to="/" activeClassName="activeRoute">
            Sign in
          </IndexLink>
        </div>
      ) : (
        <div className="navigationLink">
          <h3> Log in </h3>
          <span>{'Don\'t have an NICE Account?'}</span>
          <Link data-qa-sel="Signin-link-login" to="/register" activeClassName="activeRoute">
            Sign up
          </Link>
        </div>
      )}
    </div>
  )
}

// Navigation.propTypes = {
//   children: PropTypes.element.isRequired
// }

export default Navigation
