import React from 'react';
import { Alert } from "@nice-digital/nds-alert";
import { Input } from '@nice-digital/nds-forms';
import { NavLink, Link } from 'react-router-dom';
import { isDomainInUsername, validateRegisterFields } from '../../helpers';
import AuthApi from '../../services/AuthApi';
import './ForgotPassword.scss';

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props)
    this.auth = new AuthApi()
    this.state = {
      message: props.location.state?.message,
      email: null,
      errors: {
        email: false
      },
      serverSideError: null,
      loading: false,
      isAD: false
    }
  }

  forgotPassword = (event) => {
    if (event) event.preventDefault();

    this.setState(function(state) {
      const tests = validateRegisterFields(this.state);
      const email = !state.email || tests.email();

      return {
        errors: {
          email: email
        }
      };
    }, () => {
      if (!this.state.errors.email) {
        this.doForgotPassword();
      } else {
        this.setState({ serverSideError: null });
      }
    });    
  };

  doForgotPassword = () => {
    const serverErrorCallback = err => {
      console.error(err);

      this.setState({
        serverSideError: err.description || err.name,
        loading: false
      });
    };
    
    try {
      this.setState({ loading: true });

      this.auth.forgotPassword(
        this.state.email,
        serverErrorCallback,
        this.props.history
      );
    } catch (err) {
      console.error(err);

      this.setState({ 
        serverSideError: err.message || err.name, 
        loading: false 
      });
    }
  };

  handleChange = (event) => {
    let name = event.target.name,
      value = event.target.value;

    this.setState(function(state) {
      let isAD = (name === 'email') ? isDomainInUsername(value) : state.isAD;

      return {
        [name]: value,
        serverSideError: null,
        isAD
      };
    }, () => {
      if (this.state.errors.email) {
        this.validate();
      }
    });
  };

  clearError = (event) => {
    let eventTargetName = event.target.name;

    this.setState(function(state) {
      return {
        errors: { ...state.errors, [eventTargetName]: false },
        serverSideError: null
      };
    });
  };

  validate = () => {
    const tests = validateRegisterFields(this.state);
    const email =  this.state.email ? tests.email(this.state.email) : this.state.errors.email;
    
    this.setState({
      errors: {
        email: email,
      }
    });
  };

  render() {
    const { serverSideError, errors, loading, email, isAD, message } = this.state;

    return (
      <div>
        <h2>Reset your password</h2>
        {message && <p class="alert alert--error">{message}</p>}
        <p className="lead">
          Enter the email address you registered with in the box below and click the reset button. We'll send you an email with a link to help you reset your password.
        </p>
        <form className="">
          {serverSideError && (
            <Alert type="error">{serverSideError}</Alert>
          )}
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
            // onFocus={this.clearError}
            aria-describedby="email-error"
            value={this.state.value}
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
