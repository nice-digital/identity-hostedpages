import React, { Component }  from 'react';
import { Alert } from '@nice-digital/nds-alert';
import { Input } from '@nice-digital/nds-forms';
import { FormGroup } from '@nice-digital/nds-form-group';
import { Checkbox } from '@nice-digital/nds-checkbox';
import { getFirstErrorElement, validateFields, isDomainInUsername } from '../../helpers';
import AuthApi from '../../services/AuthApi';
import './Register.scss';
import { NavLink } from "react-router-dom";
import { auth as authOpts } from '../../services/constants';

class Register extends Component {
  constructor(props) {
    super(props)
    this.auth = new AuthApi()
    this.state = {
      tAndC: false,
      allowContactMe: false,
      email: null,
      password: null,
      confirmPassword: null,
      name: null,
      surname: null,
      errors: {
        email: false,
        password: false,
        confirmPassword: false,
        name: false,
        surname: false,
        tAndC: false
      },
      showAlert: false,
      serverSideError: null,
      loading: false,
      isAD: false
    }
  }

  scrollIntoErrorPanel = () => {
    document
      .getElementById('thereIsAnError')
      .scrollIntoView({ block: 'center' })    
    return true
  }

  register = (event) => {
    if (event) event.preventDefault();
    // Trigger field validation before submission/registration.
    // Set errors if fields are empty on invalid.
    this.setState(function(state){
      const tests = validateFields(state);
      return {
        errors: {
          email: !state.email || tests.email(),
          password: !state.password || tests.password(),
          confirmPassword: !state.confirmPassword || tests.confirmPassword(),
          name: !state.name || tests.name(),
          surname: !state.surname || tests.surname(),
          tAndC: !state.tAndC
        }
      };
    }, () => {
      if (this.isValidRegistration()) {
        this.doRegistration();
      } else {
        this.setState({ showAlert: true, serverSideError: null }, this.scrollIntoErrorPanel)
      }
    });
  };

  isValidRegistration = () => {
    let hasErrors = Object.keys(this.state.errors).map(itm => this.state.errors[itm]).reduce((defaultErrorValue, hasError) => {
      return defaultErrorValue || hasError
    }, false);
    return !hasErrors;
  };

  doRegistration = () => {
    const serverErrorCallback = err => this.setState(function() {
        console.error(err);
        return {
          serverSideError: err.description || err.name, loading: false
        }},
      this.scrollIntoErrorPanel
    );
    try {
      this.setState({ showAlert: false, loading: true });
      let { email, password, name, surname, tAndC, allowContactMe } = this.state;
      // acceptedTerms and allowContactMe need to be strings due to
      // auth0 only accepting strings in the user_metadata sent to
      // the user signup endpoint
      this.auth.register(
        email,
        password,
        name,
        surname,
        tAndC.toString(),
        allowContactMe.toString(),
        serverErrorCallback,
        this.props.history
      )
    } catch (err) {
      this.setState(function() {
          console.error(err);
          return {
            serverSideError: err.message || err.name, loading: false
          }},
        this.scrollIntoErrorPanel
      );
    }
  };

  handleCheckboxChange = (event) => {
    //event persistence for setState
    let name = event.target.name;
    let checked = event.target.checked;
    this.setState(function(state) {
      let errors = name === 'tAndC' ? { ...state.errors, tAndC: false } : state.errors;
      return {
        [name]: checked,
        errors
      };
    });
  };

  handleChange = (event) => {
    //event persistence for setState
    let name = event.target.name;
    let value = event.target.value;

    this.setState(function(state) {
      let isAD = (name === 'email') ? isDomainInUsername(value) : state.isAD;
      return {
        [name]: value,
        serverSideError: null,
        isAD,
        connection: isAD ? this.ADConnection : authOpts.connection
      }
    });
  };

  clearError = (event) => {
    let eventTargetName = event.target.name;
    this.setState(function(state) {
      return {
        errors: {...state.errors, [eventTargetName]: false},
        showAlert: false,
        serverSideError: null
      };
    });
  };

  validate = () => {
    // Validate fields as you go. It doesn't check if fields are empty.
    // That's only done on submission
    const tests = validateFields(this.state);
    this.setState(function(state) {
      return {
        errors: {
          email: state.email ? tests.email(state.email) : state.errors.email,
          password: state.password ? tests.password() : state.errors.password,
          confirmPassword: state.confirmPassword ? tests.confirmPassword() : state.errors.confirmPassword,
          name: state.name ? tests.name() : state.errors.name,
          surname: state.surname ? tests.surname() : state.errors.surname,
          tAndC: state.errors.tAndC
        }
      };
    });
  };

  goToAlert = (event) => {
    if (event) event.preventDefault();

    getFirstErrorElement(this.state.errors).scrollIntoView({ block: 'center' })
  };

  render() {
    const {
      allowContactMe,
      tAndC,
      errors,
      showAlert,
      email,
      password,
      confirmPassword,
      name,
      surname,
      loading,
      isAD,
      serverSideError
    } = this.state;
    return (
      <div>
        <h3> Create account </h3>
        <p className="lead"><NavLink
          data-qa-sel="Signin-link-login"
          to="/"
          activeclassname="activeRoute"
        >
          Sign in
        </NavLink> if you already have a NICE account.</p>
        <form className="">
          <p className="lead">
            Use your work email address if you have one.
          </p>
          <fieldset className="form-group">
            <legend className="form-group__legend">
              Personal information
	          </legend>
            <div id="thereIsAnError">
              {showAlert && (
                <Alert
                  data-qa-sel="problem-alert-register"
                  type="error"
                  aria-labelledby="error-summary-title"
                >
                  <p className="lead">There is a problem</p>
                  <button
                    role="link"
                    tabIndex="0"
                    onKeyPress={this.goToAlert}
                    onClick={this.goToAlert}
                  >
                    Click here to see the errors
                  </button>
                </Alert>
              )}
              {serverSideError && (
                <Alert
                  data-qa-sel="problem-alert-register-serverError"
                  type="error"
                  aria-labelledby="error-server-title"
                >
                  <div className="lead">
                    {serverSideError === 'The user already exists.' ?
                      <div>
                        An account already exists for this email address.<br/>
                        <NavLink data-qa-sel="Signin-link-login" to="/" activeclassname="activeRoute">
                          Sign in
                        </NavLink>
                        {/* <Link className="forgotPasswordRegister" data-qa-sel="forgotPassword-register" to="/forgotPassword">
                          Forgot password?
                        </Link> */}
                      </div>
                      :
                      <div>
                        {serverSideError}
                      </div>
                    }
                  </div>
                </Alert>
              )}
            </div>
            <Input
              data-qa-sel="email-register"
              label="Email"
              id="email" 
              name="email"
              unique="email"
              type="email"
              placeholder="eg: your.name@example.com..."
              value={this.state.value}
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
            {isAD && (
            <Alert type="caution">
              You already have an account. <NavLink data-qa-sel="Signin-link-login" to="/" activeclassname="activeRoute">Sign in</NavLink> using your NICE email address and password.
            </Alert>
            )}
            <Input
              data-qa-sel="password-register"
              name="password"
              unique="password"
              type="password"
              label="Password"
              onChange={this.handleChange}
              error={errors.password}
              errorMessage={`${
                !password
                  ? 'This field is required'
                  : 'Please provide a password with least 8 characters in length, contain at least 3 of the following 4 types of characters: lower case letters (a-z), upper case letters (A-Z), numbers (i.e. 0-9) and special characters (e.g. !@#$%^&*)'
              }`}
              onBlur={this.validate}
              onFocus={this.clearError}
              aria-describedby="password-error"
              autoComplete="new-password"
            />
            <Input
              data-qa-sel="confirm-password-register"
              name="confirmPassword"
              unique="confirmPassword"
              type="password"
              label="Confirm password"
              onChange={this.handleChange}
              error={errors.confirmPassword}
              errorMessage={`${
                !confirmPassword
                  ? 'This field is required'
                  : 'Password doesn\'t match'
              }`}
              onBlur={this.validate}
              onFocus={this.clearError}
              aria-describedby="confirmPassword-error"
              autoComplete="new-password"
            />
            <Input
              data-qa-sel="name-register"
              name="name"
              unique="firstName"
              label="First name"
              onChange={this.handleChange}
              error={errors.name}
              errorMessage={`${
                !name
                  ? 'This field is required'
                  : 'First name should contain letters and should not exceed 100 characters'
              }`}
              onBlur={this.validate}
              onFocus={this.clearError}
              aria-describedby="name-error"
            />
            <Input
              data-qa-sel="surname-register"
              name="surname"
              unique="lastName"
              label="Last name"
              onChange={this.handleChange}
              error={errors.surname}
              errorMessage={`${
                !surname
                  ? 'This field is required'
                  : 'Last name should contain letters and should not exceed 100 characters'
              }`}
              onBlur={this.validate}
              onFocus={this.clearError}
              aria-describedby="surname-error"
            />
            </fieldset>
            <p className="lead">We use cookies:</p>
            <ul>
              <li>
                To monitor usage of the NICE websites in order to improve our
                services
              </li>
              <li>
                To remember what you view on our websites and enable us to tailor
                our services to you.
              </li>
            </ul>
            <FormGroup 
              legend="Terms and conditions" 
              name="tAndC" 
              groupError={errors.tAndC ? ("You must accept Terms and Conditions to be able to create an account.") : null}
            >
              <Checkbox
                data-qa-sel="tc-checkbox-register"
                name="tAndC"
                label="I agree to NICE's terms and conditions, and the use of cookies."
                checked={tAndC}
                onChange={this.handleCheckboxChange}
                error={errors.tAndC}
                aria-describedby="tandc-error"
                value="agree"
                hint=<a href="https://www.nice.org.uk/terms-and-conditions" target="_blank" rel="noopener noreferrer">Terms and conditions <span className="visually-hidden">(opens in a new tab)</span></a>
              />
            </FormGroup>
            <FormGroup 
              legend="Join our Audience Insight Community" 
              name="allowContactMe"
            >
              <Checkbox                
                data-qa-sel="ai-checkbox-register"
                name="allowContactMe"
                checked={allowContactMe}
                label="Our insight community helps us improve our products and services. "
                onChange={this.handleCheckboxChange}
                value="agree"
                hint=<a href="https://www.nice.org.uk/get-involved/help-us-improve" target="_blank" rel="noopener noreferrer">Find out more about the Audience Insight Community <span className="visually-hidden">(opens in a new tab)</span></a>
              />
            </FormGroup>

            <Alert>
              The information you provide on this form will be used by us to
              administer your NICE account. For more information about how we
              process your data, see our{' '}
              <a
                href="https://www.nice.org.uk/privacy-notice"
                target="_blank"
                rel="noopener noreferrer"
              >
                privacy notice
              </a>
            </Alert>

          {!loading ? (
            <button
              data-qa-sel="Register-button"
              className="btn btn--cta"
              onClick={e => this.register(e)}
            >
              Register
            </button>
          ) : (
            'Loading...'
          )}
        </form>
      </div>
    )
  }
}

export default Register
