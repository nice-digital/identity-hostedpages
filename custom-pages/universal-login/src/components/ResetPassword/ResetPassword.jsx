import React, { Component } from "react";
import { Alert } from "@nice-digital/nds-alert";
import { Input } from "@nice-digital/nds-input";

import { AuthApi } from "../../services/AuthApi";
import { getFirstErrorElement, validateRegisterFields } from "../../helpers";

import "./ResetPassword.scss";

export class ResetPassword extends Component {
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
    const tests = validateRegisterFields(this.state)
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
    const { errors, showAlert } = this.state;
    return (
      <div>
        <h2 className="mt--0">Reset password</h2>
        <p className="lead">Please enter your new password</p>
        <form className="">

            <div id="thereIsAnError">
              {showAlert && (
                <Alert
									data-qa-sel="problem-alert-resetPassword"
                  type="error"
                  aria-labelledby="error-summary-title"
									role="alert">
                  <p className="lead">There is a problem</p>
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
              unique="password"
              label="Password"
              onChange={this.handleChange}
              error={errors.password}
              errorMessage="Please provide a password with at least 14 characters in length, contains at least 3 of the following 4 types of characters: lower case letters (a-z), upper case letters (A-Z), numbers (i.e. 0-9) and special characters (e.g. !@#$%^&*)"
              onBlur={this.validate}
              onFocus={this.clearError}
              aria-describedby="password-error"
              autoComplete="new-password"
            />
            <Input
              data-qa-sel="confirm-password-resetPassword"
              name="confirmPassword"
              type="password"
              unique="confirmPassword"
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

        </form>
      </div>
    )
  }
}
