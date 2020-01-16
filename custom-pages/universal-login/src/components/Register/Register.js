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
      confirmEmail: null,
      password: null,
      confirmPassword: null,
      name: null,
      surname: null,
      errors: {
        email: false,
        confirmEmail: false,
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
    if (event) event.preventDefault()
    const errorCallback = err =>
      this.setState(
        { serverSideError: err.description, loading: false },
        this.scrollIntoErrorPanel
      )
    const {
      email, password, name, surname, tAndC, allowContactMe
    } = this.state

    this.validate()
    this.catchBlanks()
    
    if (this.isFormValidForSubmission()) {
      try {
        this.setState({ loading: true })
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
          errorCallback,
          this.props.history
        )
      } catch (err) {
        this.setState({ loading: false })
        throw new Error(err)
      }
    } else {
      this.setState({ showAlert: true }, this.scrollIntoErrorPanel)
    }
  }

  handleCheckboxChange = (event) => {
    const errors =
      event.target.name === 'tAndC'
        ? { ...this.state.errors, tAndC: false }
        : this.state.errors
    this.setState({
      [event.target.name]: event.target.checked,
      errors
    })
  }

  handleChange = ({ target: { name, value } }) => {
    let isAD = null;
    if (name === 'email') {
      isAD = isDomainInUsername(value);
    }
    this.setState({
      [name]: value,
      serverSideError: null,
      isAD,
      connection: isAD ? this.ADConnection : authOpts.connection
    })
  }

  clearError = (event) => {
    this.setState({
      errors: { ...this.state.errors, [event.target.name]: false },
      showAlert: false,
      serverSideError: null
    })
  }

  isFormValidForSubmission() {
    const {
      email, password, tAndC, name, surname, errors
    } = this.state
    const isErrors = Object.keys(errors).reduce(
      (previousValue, nextElementName) =>
        previousValue || errors[nextElementName],
      false // use a positive (error=false) for a start value on the previousValue
    )
    return email && password && name && surname && tAndC && !isErrors
  }

  catchBlanks() {
    const {
      email,
      password,
      name,
      surname,
      confirmEmail,
      confirmPassword,
      tAndC
    } = this.state
    this.setState({
      errors: {
        email: !email,
        password: !password,
        name: !name,
        surname: !surname,
        confirmEmail: !confirmEmail,
        confirmPassword: !confirmPassword,
        tAndC: !tAndC
      }
    })
  }

  validate = () => {
    const tests = validateFields(this.state)
    this.setState({
      errors: {
        email: tests.email(),
        confirmEmail: tests.confirmEmail(),
        password: tests.password(),
        confirmPassword: tests.confirmPassword(),
        name: tests.name(),
        surname: tests.surname()
        // tAndC: tests.tAndC()
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
    const {
      allowContactMe,
      tAndC,
      errors,
      showAlert,
      email,
      password,
      name,
      surname,
      loading,
      isAD,
      serverSideError
    } = this.state
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
                  <p className="lead">
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
                  </p>
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
              data-qa-sel="confirm-email-register"
              label="Confirm email"
              name="confirmEmail"
              unique="confirmEmail"
              type="email"
              placeholder="eg: your.name@example.com..."
              onChange={this.handleChange}
              error={errors.confirmEmail}
              errorMessage="Email address doesn't match"
              onBlur={this.validate}
              onFocus={this.clearError}
              aria-describedby="confirmEmail-error"
            />
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
              errorMessage="Password doesn't match"
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
                  : 'First name should not exceed 100 characters'
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
                  : 'Last name should not exceed 100 characters'
              }`}
              onBlur={this.validate}
              onFocus={this.clearError}
              aria-describedby="surname-error"
            />
            </fieldset>
            <ul>

              <p className="lead">We use cookies:</p>

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
                hint=<a href="https://www.nice.org.uk/terms-and-conditions" target="_blank" rel="noopener noreferrer">Terms and conditions <span class="visually-hidden">(opens in a new tab)</span></a>
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
                hint=<a href="https://www.nice.org.uk/get-involved/help-us-improve" target="_blank" rel="noopener noreferrer">Find out more about the Audience Insight Community <span class="visually-hidden">(opens in a new tab)</span></a>
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
