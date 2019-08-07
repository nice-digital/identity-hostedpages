import React from 'react'
import Alert from '@nice-digital/nds-alert'

// local imports
import { hideNav } from '../../util'

// style
import './RegisterSuccess.scss'
import Nav from "../../components/Navigation";

export const RegisterSuccess = () => {
  hideNav();
  return (
    <div>
      <Nav/>
      <h3>Thank you</h3>
      <h5>
        We've sent you an email with an activation link. To verify your details
        and start using your account, click on the link.
      </h5>
      <Alert type="caution">
        Note: check your spam folder if you do not receive the activation email.
      </Alert>
      <p>
        <a href="#">&larr; Take me back to Login</a>
      </p>
    </div>
  )
};

export default RegisterSuccess
