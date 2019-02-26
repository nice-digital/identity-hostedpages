import React from 'react'
// import Logo from '../assets/logo.png'
import AuthApi from '../../../services/AuthApi'
import './RegisterForm.scss'

export class Register extends React.Component {
  constructor(props) {
    super(props)
    this.auth = new AuthApi()
  }

  doSomething = (e) => {
    e.preventDefault()
    console.log('button pressed')
    this.auth.register()
  }
  render() {
    return (
      <form className="panel mainpanel">
        {/* <img alt="nice logo" className={classes.logo} src={Logo} /> */}
        <label id="email" htmlFor="email">
          Email
          <br />
          <input name="email" type="email" placeholder="eg: your.name@example.com..." />
        </label>
        <label id="confirmEmail" htmlFor="confirmEmail">
          Confirm Email
          <br />
          <input name="confirmEmail" type="email" placeholder="eg: your.name@example.com..." />
        </label>
        <label id="password" htmlFor="password">
          Password
          <br />
          <input name="password" type="password" />
        </label>
        <label id="confirmPassword" htmlFor="confirmPassword">
          Confirm Password
          <br />
          <input name="confirmPassword" type="password" />
        </label>
        <label id="name" htmlFor="name">
          Name
          <br />
          <input name="name" />
        </label>
        <label id="surname" htmlFor="surname">
          Surname
          <br />
          <input name="surname" />
        </label>
        <ul>
          <h6>Cookies will be used in the fulowing ways:</h6>
          <li>
            Analytical purposes – for monitoring usage of the NICE websites in order to improve our
            services
          </li>
          <li>
            Your preferences – to remember what you view on our websites and to enable us to tailor
            our services to you
          </li>
        </ul>
        <label className="checkbox" id="allowContactMe" htmlFor="allowContactMe">
          The Audience Insight Community helps NICE improve its products and services - please tick
          this box if you would like to get involved. Find out more about the Audience Insight
          Community
          <input name="allowContactMe" type="checkbox" value="true" />
        </label>
        <label className="checkbox" id="tAndC" htmlFor="tAndC">
          By signing up, you agree to our terms of service and privacy policy.
          <input name="tAndC" type="checkbox" value="false" />
        </label>
        <h6>
          The information you provide on this form will be used by us to administer your NICE
          account. For more information about how we process your data, see our{' '}
          <a href="#">privacy notice</a>
        </h6>
        <button className="btn btn--cta" onClick={e => this.doSomething(e)}>
          Sign up
        </button>
      </form>
    )
  }
}

export default Register
