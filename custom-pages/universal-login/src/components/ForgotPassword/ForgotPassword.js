import React from 'react';
import { Alert } from "@nice-digital/nds-alert";
import { Input } from '@nice-digital/nds-forms';
import { NavLink, Link } from 'react-router-dom';
import { isDomainInUsername, validateFields, getFirstErrorElement } from '../../helpers';
import AuthApi from '../../services/AuthApi';
import './ForgotPassword.scss';

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props)
    this.auth = new AuthApi()
    this.state = {
      email: null,
      error: null,
      errors: {
        email: false
      },
      loading: false,
      isAD: false
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
        this.auth.forgotPassword(email, this.requestErrorCallback, this.props.history)
      })
    } catch (err) {
      this.setState({ loading: false })
    }
  }

  handleChange = ({ target: { name, value } }) => {
    let isAD = null;
    if (name === 'email') {
      isAD = isDomainInUsername(value);
    }
    this.setState(
      {
        [name]: value,
        error: null,
        isAD,
      },
      this.isValid
    )
  }

  clearError = (event) => {
    this.setState({
      errors: { ...this.state.errors, [event.target.name]: false },
      serverSideError: null
    })
  }

  isFormValidForSubmission() {
    const {
      email, errors
    } = this.state
    const isErrors = Object.keys(errors).reduce(
      (previousValue, nextElementName) =>
        previousValue || errors[nextElementName],
      false // use a positive (error=false) for a start value on the previousValue
    )
    return email && !isErrors
  }

  catchBlanks() {
    const {
      email
    } = this.state
    this.setState({
      errors: {
        email: !email
      }
    })
  }

  validate = () => {
    const tests = validateFields(this.state)
    this.setState({
      errors: {
        email: tests.email()
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
    const { error, errors, loading, email, isAD, showAlert } = this.state
    return (
      <div>
        <h3>Reset your password</h3>
        <p class="lead">
          Enter the email address you registered with in the box below and click the reset button. We'll send you an email with a link to help you reset your password.
        </p>
        <form className="">
            {error && <Alert type="error">{error}</Alert>}
            <Input
              data-qa-sel="forgotPassword-email"
              label="Email"
              id="email"
              name="email"
              unique="email"
              type="email"
              placeholder="eg: your.name@example.com..."
              onChange={this.handleChange}
              error={errors.email}
              errorMessage={`${
                !email
                  ? 'This field is required'
                  : 'Email address is in an invalid format'
              }`}
              onBlur={this.validate}
              onFocus={this.clearError}
              aria-describedby="email-error"
            />
          {isAD ? (
            <Alert type="info">
              NICE staff should <NavLink data-qa-sel="Signin-link-login" to="/" activeclassname="activeRoute">sign in</NavLink> using the password you use to sign in to your work computer. 
            </Alert>
          ) : (
          !loading ? (
            <button
              data-qa-sel="forgotPassword-button"
              className="btn btn--cta"
              onClick={this.forgotPassword}
            >
              Reset password
            </button>
          ) : (
            'Loading...'
          )
          )}
        </form>
        {!isAD &&
        <Link data-qa-sel="forgotPassword-link-to-login" to="/">
          Return to sign in
        </Link>
        }
      </div>

    )
  }
}

export default ForgotPassword
