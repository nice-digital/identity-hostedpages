import React from 'react'
import Alert from '@nice-digital/nds-alert'

// local imports
import { hideNav } from '../../util'

// style
import './RegisterSuccess.scss'

export const RegisterSuccess = () => {
  hideNav()
  return (
    <div>
      <h3>Thank you!</h3>
      <h5>
        To complete registration, please check your email account and confirm
        your details using the activation link.
      </h5>
      <Alert type="caution">
        Note: if you do not receive an activation email please check your spam
        folder.
      </Alert>
      <p>
        <a href="#">&larr; Take me back to Login</a>
      </p>
    </div>
  )
}

export default RegisterSuccess
