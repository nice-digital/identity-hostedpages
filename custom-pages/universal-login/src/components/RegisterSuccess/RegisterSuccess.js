import React from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '@nice-digital/nds-alert';
import './RegisterSuccess.scss';

const RegisterSuccess = () => {
  return (
    <div>
      <h3>Thank you</h3>
      <p class="lead">
        We've sent you an email with an activation link. Click on the link to verify your details and start using your account.
      </p>
      <Alert type="caution">
        Check your spam folder if you do not receive the activation email.
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
