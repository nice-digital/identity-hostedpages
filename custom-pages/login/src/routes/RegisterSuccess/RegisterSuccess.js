import React from 'react'
import Alert from '@nice-digital/nds-alert'
import './RegisterSuccess.scss'

export const RegisterSuccess = () => {
  setTimeout(() => {
    document.querySelector('.navigationLink h3').textContent = 'Thank you!'
    document.querySelector('.navigationLink span').remove()
    document.querySelector('.navigationLink a').remove()
  })
  return (
    <div>
      <h5>
        To complete registration, please check your email account and confirm
        your details using the activation link.
      </h5>
      <Alert type="info">
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
