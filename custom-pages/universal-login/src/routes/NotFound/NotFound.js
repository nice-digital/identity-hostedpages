import React from 'react'
import { createBrowserHistory } from 'history'
import './NotFound.scss'

const goBack = (e) => {
  e.preventDefault()
  return createBrowserHistory.goBack()
}

export const NotFound = () => (
  <div className="notFound">
    <h4>Something must have gone slightly wrong!</h4>
    <p><a href="#" onClick={goBack}>&larr; Back</a></p>
  </div>
)

export default NotFound
