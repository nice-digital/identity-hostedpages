import React from 'react'
// import Alert from '@nice-digital/nds-alert'
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
      allowContactMe: true
    }
  }

  doSomething = (e) => {
    e.preventDefault()
    console.log('button pressed')
    this.auth.register()
  }

  handleCheckboxChange = (e) => {
    this.setState({ [e.target.name]: e.target.checked })
  }
  render() {
    const { allowContactMe, tAndC } = this.state
    return (
      <form className="">
        <Fieldset legend="Personal Information">
          {/* <img alt="nice logo" className={ classes.logo} src={Logo} /> */}
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="eg: your.name@example.com..."
          />
          <Input
            label="Confirm Email"
            name="confirmEmail"
            type="email"
            placeholder="eg: your.name@example.com..."
          />
          <Input name="password" type="password" label="Password" />
          <Input
            name="confirmPassword"
            type="password"
            label="Confirm Password"
          />
          <Input name="name" label="Name" />
          <Input name="surname" label="Surname" />
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
          <Fieldset classNane="checkboxFieldset" legend="Audience Insight Community - Get involved">
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
          <h6>
            The information you provide on this form will be used by us to
            administer your NICE account. For more information about how we
            process your data, see our <a href="#">privacy notice</a>
          </h6>
          <button className="btn btn--cta" onClick={e => this.doSomething(e)}>
            Sign up
          </button>
        </Fieldset>
      </form>
    )
  }
}

export default Register
