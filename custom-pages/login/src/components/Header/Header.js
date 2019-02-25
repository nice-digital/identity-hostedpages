import React from 'react'
import PropTypes from 'prop-types'
import './Header.scss'

export const Header = props => (
  <div className={props.className}>
    <h1>NICE accounts</h1>
    <h4>A single sign-in for the different services offered by NICE.</h4>
  </div>
)

Header.propTypes = {
  className: PropTypes.string
}

Header.defaultProps = {
  className: ''
}

export default Header
