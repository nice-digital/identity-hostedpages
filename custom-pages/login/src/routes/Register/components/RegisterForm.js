import React from 'react'
import Alert from '@nice-digital/nds-alert'
import { Input, Fieldset, Checkbox } from '@nice-digital/nds-forms'
// local imports
import { showNav, getFirstErrorElement, validateFields } from '../../../util'
import AuthApi from '../../../services/AuthApi'
import './RegisterForm.scss'
import isIE8 from '../../../util/isIE8'

export class Register extends React.Component {
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
      loading: false
    }
  }

  scrollIntoErrorPanel = () => {
    if (!isIE8()) {
      document
        .getElementById('thereIsAnError')
        .scrollIntoView({ block: 'center' })
    }
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
      email, password, name, surname, allowContactMe
    } = this.state

    if (!isIE8()) {
      this.validate()
      this.catchBlanks()
    }
    if (this.isFormValidForSubmission() || isIE8()) {
      try {
        this.setState({ loading: true })
        this.auth.register(
          email,
          password,
          name,
          surname,
          allowContactMe.toString(),
          errorCallback
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

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      serverSideError: null
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
    if (!isIE8()) {
      getFirstErrorElement(this.state.errors).scrollIntoView({
        block: 'center'
      })
    }
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
      serverSideError
    } = this.state
    showNav(true)
    return (
      <form className="">
        <h6>
          Your email address should be your work email address if you have one.
        </h6>
        <Fieldset legend="Personal information">
          <div id="thereIsAnError">
            {showAlert && (
              <Alert
                data-qa-sel="problem-alert-register"
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
            {serverSideError && (
              <Alert
                data-qa-sel="problem-alert-register-serverError"
                type="error"
                aria-labelledby="error-server-title"
              >
                <h5>{serverSideError}</h5>
              </Alert>
            )}
          </div>
          <Input
            data-qa-sel="email-register"
            label="Email"
            name="email"
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
          <Input
            data-qa-sel="confirm-email-register"
            label="Confirm email"
            name="confirmEmail"
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
          />
          <Input
            data-qa-sel="confirm-password-register"
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
          <Input
            data-qa-sel="name-register"
            name="name"
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
          <ul>
            <h5>We use cookies:</h5>
            <li>
              To monitor usage of the NICE websites in order to improve our
              services
            </li>
            <li>
              To remember what you view on our websites and enable us to tailor
              our services to you.
            </li>
          </ul>
          <Fieldset classNane="checkboxFieldset" legend="Terms and conditions">
            {errors.tAndC ? (
              <Alert data-qa-sel="tc-unchecked-error" type="error">
                You must accept Terms and Conditions to be able to create an
                account.
              </Alert>
            ) : null}
            <Checkbox
              data-qa-sel="tc-checkbox-register"
              name="tAndC"
              label="I agree to NICE's terms and conditions, and the use of cookies."
              checked={tAndC}
              onChange={this.handleCheckboxChange}
              error={errors.tAndC}
              aria-describedby="tandc-error"
            />
          </Fieldset>
          <Fieldset
            classNane="checkboxFieldset"
            legend="Join our Audience Insight Community"
          >
            <Checkbox
              data-qa-sel="ai-checkbox-register"
              name="allowContactMe"
              checked={allowContactMe}
              label="Our insight community helps us improve our products and services. "
              onChange={this.handleCheckboxChange}
            />
          </Fieldset>

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
        </Fieldset>
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
    )
  }
}

export default Register
