import React from 'react'
import PropTypes from 'prop-types'
import './Header.scss'

const Header = props => (
  <div className={props.className}>
    <h1>NICE accounts</h1>
  </div>
)

Header.propTypes = {
  className: PropTypes.string
}

Header.defaultProps = {
  className: ''
}

export default Header