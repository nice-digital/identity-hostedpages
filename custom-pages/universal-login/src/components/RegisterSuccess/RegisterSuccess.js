import React from 'react';
import { Link } from 'react-router-dom';

import { Alert } from '@nice-digital/nds-alert';

import { hideNav } from '../../helpers';
import './RegisterSuccess.scss';
import Nav from "../Nav/Nav";


const RegisterSuccess = () => {
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
        <Link data-qa-sel="registerSuccess-link-to-login" to="/">
            Return to sign in
        </Link>
      </p>
    </div>
  )
};

export default RegisterSuccess
