import React from 'react'
import Alert from '@nice-digital/nds-alert'
import { Link } from 'react-router'

// local imports
import { hideNav } from '../../util'

// style
import './ResetPasswordSuccess.scss'

export const ResetPasswordSuccess = () => {
  hideNav()
  return (
    <div>
      <h3>Thank you!</h3>
      <Alert type="success">
        Your password has been changed and you will need to sign in with it, if this page
        does not automatically refresh <Link data-qa-sel="resetPasswordSuccess-link-to-login" to="/"> click here </Link>
      </Alert>
    </div>
  )
}

export default ResetPasswordSuccess
