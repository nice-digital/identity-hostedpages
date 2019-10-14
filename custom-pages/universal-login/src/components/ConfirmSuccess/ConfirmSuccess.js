import React from 'react';
import { Alert } from '@nice-digital/nds-alert';
import { Link } from 'react-router-dom';

// local imports
import { hideNav } from '../../helpers';

// style
import Nav from "../Nav/Nav";

export const ConfirmSuccess = () => {
  // setTimeout(() => (document.location = '/login'), 5000)
  hideNav()
  return (
    <div>
      <Nav />
      <h3>Thank you!</h3>
      <Alert type="success">
        Your account was activated successfully. If this page does not automatically refresh {' '}
         <Link data-qa-sel="resetPasswordSuccess-link-to-login" to="/">
          {' '}
          click here{' '}
        </Link>
      </Alert>
    </div>
  )
}

export default ConfirmSuccess
