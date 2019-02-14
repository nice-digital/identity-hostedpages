import React from 'react'
import { IndexLink, Link } from 'react-router'
import classes from './Header.css'

export const Header = () => (
  <div>
    <h1>NICE Accounts</h1>
    <IndexLink to="/" activeClassName={classes.activeRoute}>
      Login
    </IndexLink>
    {' · '}
    <Link to="/register" activeClassName={classes.activeRoute}>
      Register
    </Link>
  </div>
)

export default Header
