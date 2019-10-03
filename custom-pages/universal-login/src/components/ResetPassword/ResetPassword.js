import React from 'react';
import { Alert } from '@nice-digital/nds-alert';
import { Input } from '@nice-digital/nds-forms';
import { FormGroup } from '@nice-digital/nds-form-group';
import { hideNav, getFirstErrorElement, validateFields } from '../../helpers';
import AuthApi from '../../services/AuthApi';
import './ResetPassword.scss';
import Nav from "../Nav/Nav";

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
    if (this.isFormValidForSubmission()) {
      this.auth.resetPassword(password, null, this.props.history)
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
        <Nav />
        <h3>Reset password</h3>
        <h5>Please enter your new password</h5>
        <form className="">
          <FormGroup legend="Personal information">
            <div id="thereIsAnError">
              {showAlert && (
                <Alert data-qa-sel="problem-alert-resetPassword"
                  type="error"
                  aria-labelledby="error-summary-title" >
                  <h5>There is a problem</h5>
                  <button role="link" tabIndex="0" onKeyPress={this.goToAlert} onClick={this.goToAlert}>
                    Click here to see the errors
                  </button>
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
              autoComplete="new-password"
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
              autoComplete="new-password"
            />

            <button
              data-qa-sel="ResetPassword-button"
              className="btn btn--cta"
              onClick={e => this.resetPassword(e)}
            >
              Reset password
            </button>
          </FormGroup>
        </form>
      </div>
    )
  }
}

export default ResetPassword