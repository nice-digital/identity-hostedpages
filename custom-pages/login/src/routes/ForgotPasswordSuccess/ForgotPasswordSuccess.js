import React from 'react'
import { Link } from 'react-router'

// local imports
import { hideNav } from '../../util'

// style
import './ForgotPasswordSuccess.scss'

export const ForgotPasswordSuccess = () => {
  hideNav()
  return (
    <div>
      <h3>Success</h3>
      <h5 data-qa-sel="forgotPasswordSuccess-message1">
        If that email address is in our records, we will send an email to you
        containing instructions on how to reset your password. You may have to
        wait a few minutes for the email. If you can’t find the email, please
        check your spam and deleted items folders.
      </h5>
      <h5 data-qa-sel="forgotPasswordSuccess-message2">Please act on the email straight away.</h5>
      <Link data-qa-sel="forgotPasswordSuccess-link-to-login" to="/"> Return to Sign in </Link>
    </div>
  )
}

export default ForgotPasswordSuccess
