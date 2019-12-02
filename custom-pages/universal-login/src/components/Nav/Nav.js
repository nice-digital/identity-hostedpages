import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import './Nav.scss'

const Nav = () => {
  const register = window.location.pathname.indexOf('register') !== -1;
  return (
    <div className="navigation">
      {register ? (
        <div className="navigationLink">
          <h3> Create account </h3>
          <p className="lead"><NavLink
            data-qa-sel="Signin-link-login"
            to="/"
            activeclassname="activeRoute"
          >
            Sign in
          </NavLink> if you already have a NICE account.</p>
        </div>
      ) : (
        <div className="navigationLink">
          <h3> Log in </h3>
          <Link
            data-qa-sel="Signup-link-login"
            to="/register"
            activeclassname="activeRoute"
          >
            Create a NICE account
          </Link>
        </div>
      )}
    </div>
  )
}

export default Nav
