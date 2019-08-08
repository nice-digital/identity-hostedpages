import React from 'react'
import Alert from '@nice-digital/nds-alert'
// import { Link } from 'react-router'

// local imports
import { hideNav } from '../../helpers'

// style
import './ResetPasswordSuccess.scss'
import Nav from "../Nav/Nav";

export const ResetPasswordSuccess = () => {
  // setTimeout(() => (document.location = '/login'), 5000)
  hideNav()
  return (
    <div>
      <Nav />
      <h3>Thank you!</h3>
      <Alert type="success">
        Your password has been changed and you can now use it to sign in {' '}
        {/* <Link data-qa-sel="resetPasswordSuccess-link-to-login" to="/login">
          {' '}
          click here{' '}
        </Link> */}
      </Alert>
    </div>
  )
}

export default ResetPasswordSuccess
