import React from 'react'
import Alert from '@nice-digital/nds-alert'
import { Input, Fieldset } from '@nice-digital/nds-forms'
// local imports
import { hideNav, getFirstErrorElement, validateFields, isIE8 } from '../../../util'
import AuthApi from '../../../services/AuthApi'
import './ResetPasswordForm.scss'

export class ResetPassword extends React.Component {
  constructor(props) {
    super(props)
    this.auth = new AuthApi()
    this.state = {
      email: null,
      password: null,
      confirmPassword: null,
      errors: {
        password: false,
        confirmPassword: false
      },
      showAlert: false
    }
  }

  resetPassword = (event) => {
    if (event) event.preventDefault()
    const { password } = this.state
    this.validate()
    if (this.isFormValidForSubmission() || isIE8()) {
      this.auth.resetPassword(password)
    } else {
      this.setState({ showAlert: true }, () => {
        const el = document.getElementById('thereIsAnError')
        if (el) el.scrollIntoView({ block: 'center' })
      })
    }
  }

  handleCheckboxChange = (event) => {
    this.setState({
      [event.target.name]: event.target.checked,
      errors: { ...this.state.errors }
    })
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  clearError = (event) => {
    this.setState({
      errors: { ...this.state.errors, [event.target.name]: false },
      showAlert: false
    })
  }

  isFormValidForSubmission() {
    const { password, confirmPassword, errors } = this.state
    const isErrors = Object.keys(errors).reduce(
      (previousValue, nextElementName) =>
        previousValue || errors[nextElementName],
      false // use a positive (error=false) for a start value on the previousValue
    )
    return confirmPassword && password && !isErrors
  }

  validate = () => {
    const tests = validateFields(this.state)
    this.setState({
      errors: {
        password: tests.password(),
        confirmPassword: tests.confirmPassword()
      }
    })
  }

  goToAlert = (e) => {
    if (e) e.preventDefault()
    getFirstErrorElement(this.state.errors).scrollIntoView({
      block: 'center'
    })
  }

  render() {
    const { errors, showAlert } = this.state
    hideNav()
    return (
      <div>
        <h3>Reset password</h3>
        <h5>Please enter your new password</h5>
        <form className="">
          <Fieldset legend="Personal information">
            <div id="thereIsAnError">
              {showAlert && (
                <Alert
                  data-qa-sel="problem-alert-resetPassword"
                  type="error"
                  aria-labelledby="error-summary-title"
                >
                  <h5>There is a problem</h5>
                  <a
                    role="link"
                    tabIndex="0"
                    onKeyPress={this.goToAlert}
                    onClick={this.goToAlert}
                  >
                    Click here to see the errors
                  </a>
                </Alert>
              )}
            </div>
            <Input
              data-qa-sel="password-resetPassword"
              name="password"
              type="password"
              label="Password"
              onChange={this.handleChange}
              error={errors.password}
              errorMessage="Please provide a password with least 8 characters in length, contain at least 3 of the following 4 types of characters: lower case letters (a-z), upper case letters (A-Z), numbers (i.e. 0-9) and special characters (e.g. !@#$%^&*)"
              onBlur={this.validate}
              onFocus={this.clearError}
              aria-describedby="password-error"
            />
            <Input
              data-qa-sel="confirm-password-resetPassword"
              name="confirmPassword"
              type="password"
              label="Confirm password"
              onChange={this.handleChange}
              error={errors.confirmPassword}
              errorMessage="Password doesn't match"
              onBlur={this.validate}
              onFocus={this.clearError}
              aria-describedby="confirmPassword-error"
            />

            <button
              data-qa-sel="ResetPassword-button"
              className="btn btn--cta"
              onClick={e => this.resetPassword(e)}
            >
              Reset password
            </button>
          </Fieldset>
        </form>
      </div>
    )
  }
}

export default ResetPassword
