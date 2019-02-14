import React from 'react'
import Logo from '../assets/logo.png'
import classes from './HomeView.css'

export const HomeView = () => (
  <div>
    <h4>Login</h4>
    <img
      alt="nice logo"
      className={classes.logo}
      src={Logo}
    />
  </div>
)

export default HomeView
