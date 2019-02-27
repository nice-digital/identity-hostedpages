import React from 'react'
import Alert from '@nice-digital/nds-alert'
import { Input, Fieldset, Checkbox } from '@nice-digital/nds-forms'
// import Logo from '../assets/logo.png'
import AuthApi from '../../../services/AuthApi'
import './RegisterForm.scss'

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
        surname: false
      }
    }
  }

  doSomething = (e) => {
    e.preventDefault()
    const {
      email, password, name, surname, allowContactMe
    } = this.state
    this.auth.register(email, password, name, surname, allowContactMe, () =>
      console.log('yeeeeeeaaaaahhhh'))
  }

  handleCheckboxChange = (e) => {
    this.setState({
      [e.target.name]: e.target.checked
    })
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  clearError = (e) => {
    this.setState({ errors: { ...this.state.errors, [e.target.name]: false } })
  }

  isValid = () => {
    const { email, password, tAndC } = this.state
    const isFormValid = !Object.keys(this.state.errors).reduce(
      (acc, curr) => !!acc || this.state.errors[curr],
      false
    )
    return isFormValid && email && password && tAndC
  }

  validate = () => {
    const {
      email,
      confirmEmail,
      password,
      confirmPassword,
      name,
      surname
    } = this.state
    const expression = /\S+@\S+\.\S+/

    this.setState({
      errors: {
        email: email && !expression.test(email.toLowerCase()),
        confirmEmail: confirmEmail && email && email !== confirmEmail,
        password: password && password.length < 1,
        confirmPassword:
          password && confirmPassword && confirmPassword !== password,
        name: name && name.length > 100,
        surname: surname && surname.length > 100
      }
    })
  }

  render() {
    const { allowContactMe, tAndC, errors } = this.state
    return (
      <form className="">
        <h6>
          Your email address should be your work email address if you have one.
        </h6>
        <Fieldset legend="Personal Information">
          {/* <img alt="nice logo" className={ classes.logo} src={Logo} /> */}
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="eg: your.name@example.com..."
            onChange={this.handleChange}
            error={errors.email}
            errorMessage="Please provide a valid email"
            onBlur={this.validate}
            onFocus={this.clearError}
          />
          <Input
            label="Confirm Email"
            name="confirmEmail"
            type="email"
            placeholder="eg: your.name@example.com..."
            onChange={this.handleChange}
            error={errors.confirmEmail}
            errorMessage="Email fields do not match"
            onBlur={this.validate}
            onFocus={this.clearError}
          />
          <Input
            name="password"
            type="password"
            label="Password"
            onChange={this.handleChange}
            error={errors.password}
            errorMessage="Please provide a password"
            onBlur={this.validate}
            onFocus={this.clearError}
          />
          <Input
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            onChange={this.handleChange}
            error={errors.confirmPassword}
            errorMessage="Password fields do not match"
            onBlur={this.validate}
            onFocus={this.clearError}
          />
          <Input
            name="name"
            label="Name"
            onChange={this.handleChange}
            error={errors.name}
            errorMessage="Name should not exceed 100 characters"
            onBlur={this.validate}
            onFocus={this.clearError}
          />
          <Input
            name="surname"
            label="Surname"
            onChange={this.handleChange}
            error={errors.surname}
            errorMessage="Surname should not exceed 100 characters"
            onBlur={this.validate}
            onFocus={this.clearError}
          />
          <ul>
            <h5>Cookies will be used in the following ways:</h5>
            <li>
              Analytical purposes – for monitoring usage of the NICE websites in
              order to improve our services
            </li>
            <li>
              Your preferences – to remember what you view on our websites and
              to enable us to tailor our services to you
            </li>
          </ul>
          <Fieldset
            classNane="checkboxFieldset"
            legend="Audience Insight Community - Get involved"
          >
            <Checkbox
              name="allowContactMe"
              checked={allowContactMe}
              label="The Audience Insight Community helps NICE improve its products and
            services - please tick this box if you would like to get involved.
            Find out more about the Audience Insight Community"
              onChange={this.handleCheckboxChange}
            />
          </Fieldset>
          <Fieldset classNane="checkboxFieldset" legend="Terms and conditions">
            <Checkbox
              name="tAndC"
              label="By signing up, you agree to our terms of service and privacy policy."
              checked={tAndC}
              onChange={this.handleCheckboxChange}
            />
          </Fieldset>
          <Alert>
            The information you provide on this form will be used by us to
            administer your NICE account. For more information about how we
            process your data, see our <a href="#">privacy notice</a>
          </Alert>
          <button
            className="btn btn--cta"
            onClick={e => this.doSomething(e)}
            disabled={!this.isValid()}
          >
            Register
          </button>
        </Fieldset>
      </form>
    )
  }
}

export default Register
