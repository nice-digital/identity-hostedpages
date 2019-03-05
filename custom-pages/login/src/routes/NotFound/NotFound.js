import React from 'react'
import { browserHistory } from 'react-router'
import './NotFound.scss'

const goBack = (e) => {
  e.preventDefault()
  return browserHistory.goBack()
}

export const NotFound = () => (
  <div className="notFound">
    <h4>Something must have gone slightly wrong!</h4>
    <p><a href="#" onClick={goBack}>&larr; Back</a></p>
  </div>
)

export default NotFound
