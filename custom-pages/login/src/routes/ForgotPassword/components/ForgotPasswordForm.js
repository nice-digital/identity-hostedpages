import React from 'react'
import Alert from '@nice-digital/nds-alert'
import { Input, Fieldset } from '@nice-digital/nds-forms'
import { Link } from 'react-router'
// local imports
import { hideNav } from '../../../util'
import AuthApi from '../../../services/AuthApi'

import './ForgotPasswordForm.scss'

export class ForgotPassword extends React.Component {
  constructor(props) {
    super(props)
    this.auth = new AuthApi()
    this.state = {
      email: null,
      error: null,
      loading: false
    }
  }

  requestErrorCallback = err =>
    this.setState({
      error: err.description || err.error_description,
      loading: false
    })

  forgotPassword = (e) => {
    if (e) e.preventDefault()
    try {
      this.setState({ loading: true }, () => {
        const { email } = this.state
        this.auth.forgotPassword(email, this.requestErrorCallback)
      })
    } catch (err) {
      this.setState({ loading: false })
    }
  }

  handleChange = ({ target: { name, value } }) => {
    this.setState(
      {
        [name]: value,
        error: null
      },
      this.isValid
    )
  }

  render() {
    hideNav()
    const { error, loading, email } = this.state
    return (
      <div>
        <h3>Forgot password</h3>
        <h5>
          If you have forgotten your password, please use the password reset
          feature below. Enter the email address you registered with below and
          click the reset password button. If your account can be found we will
          send you a email with a link you can use to reset your password.
        </h5>
        <form className="">
          <Fieldset legend="Personal information">
            {error && <Alert type="error">{error}</Alert>}
            <Input
              data-qa-sel="forgotPassword-email"
              label="Email"
              id="email"
              name="email"
              type="email"
              placeholder="eg: your.name@example.com..."
              onChange={this.handleChange}
            />
          </Fieldset>
          {!loading ? (
            <button
              data-qa-sel="forgotPassword-button"
              className="btn btn--cta"
              onClick={this.forgotPassword}
              disabled={!email}
            >
              Reset password
            </button>
          ) : (
            'Loading...'
          )}
        </form>
        <Link data-qa-sel="forgotPassword-link-to-login" to="/">
          Return to sign in
        </Link>
      </div>
    )
  }
}

export default ForgotPassword
