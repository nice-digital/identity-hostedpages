import React from 'react'
import PropTypes from 'prop-types'
import Header from '../Header'
import Nav from '../Navigation'
import classes from './Layout.css'

export const CoreLayout = ({ children }) => (
  <div className={`${classes.wrapper}`}>
    <Header className={classes.col} />
    <div className={`${classes.mainContainer} ${classes.col}`}>
      <Nav />
      {children}
    </div>
  </div>
)

CoreLayout.propTypes = {
  children: PropTypes.element.isRequired
}

export default CoreLayout
