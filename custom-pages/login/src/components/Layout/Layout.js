import React from 'react'
import PropTypes from 'prop-types'
import Header from '../Header'
import Nav from '../Navigation'
import './Layout.scss'

export const CoreLayout = ({ children }) => (
  <div className="wrapper">
    <Header className="col leftCol" />
    <div className="mainContainer col rightCol">
      <Nav />
      {children}
    </div>
  </div>
)

CoreLayout.propTypes = {
  children: PropTypes.element.isRequired
}

export default CoreLayout
