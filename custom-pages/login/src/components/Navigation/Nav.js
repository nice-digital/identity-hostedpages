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
          <h3> Create account </h3>
          <span>Sign in if you already have a NICE account.</span>
          <IndexLink
            data-qa-sel="Signin-link-login"
            to="/"
            activeClassName="activeRoute"
          >
            Sign in
          </IndexLink>
        </div>
      ) : (
        <div className="navigationLink">
          <h3> Log in </h3>
          <span>Need a NICE Account?</span>
          <Link
            data-qa-sel="Signup-link-login"
            to="/register"
            activeClassName="activeRoute"
          >
            Create an account
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
