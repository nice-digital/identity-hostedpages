import React from 'react'
import auth0 from 'auth0-js'
import { auth } from '../../../services/constants'
// import Logo from '../assets/logo.png'
import classes from './RegisterForm.css'

export class Register extends React.Component {
  constructor(props) {
    super(props)
    this.auth0 = new auth0.WebAuth({
      domain: auth.domain,
      clientID: auth.clientID,
      // redirectUri: '',
      scope: auth.scope
    })
  }

  doSomething = (e) => {
    e.preventDefault()
    console.log('button pressed')
    this.auth0.signup(
      {
        connection: '',
        email: 'EMAIL@email.com',
        password: 'PASSWORD123',
        user_metadata: {
          title: 'Mr.',
          name: 'silver',
          surname: 'thisisasurname',
          allowContactMe: 'true'
        }
      },
      (err) => {
        if (err) return console.error(`Something went wrong: ${err.message}`)
        return console.log('success signup without login!')
      }
    )
  }
  render() {
    return (
      <div className={`panel ${classes.mainpanel}`}>
        {/* <img alt="nice logo" className={classes.logo} src={Logo} /> */}
        <input name="email" type="email" placeholder="eg: your.name@example.com..." />
        <input name="confirmEmail" type="email" placeholder="eg: your.name@example.com..." />
        <input name="password" type="password" />
        <input name="confirmPassword" type="password" />
        <select>
          <option value="null">Select a Title...</option>
          <option value="Mr">Mr.</option>
          <option value="Mrs">Mrs.</option>
          <option value="Miss">Miss</option>
        </select>
        <input name="name" />
        <input name="surname" />
        <h4>Cookies will be used in the following ways:</h4>
        <p>
          Analytical purposes – for monitoring usage of the NICE websites in order to improve our
          services
        </p>
        <p>
          Your preferences – to remember what you view on our websites and to enable us to tailor
          our services to you
        </p>
        <div>
          <input type="checkbox" value="true" />
          The Audience Insight Community helps NICE improve its products and services - please tick
          this box if you would like to get involved. Find out more about the Audience Insight
          Community
        </div>
        <div>
          <input type="checkbox" value="false" />
          By signing up, you agree to our terms of service and privacy policy.
        </div>
        <h4>
          The information you provide on this form will be used by us to administer your NICE
          account. For more information about how we process your data, see our <a href="#">privacy notice</a>
        </h4>
        <a href="#" className="btn" onClick={e => this.doSomething(e)}>
          Sign up
        </a>
      </div>
    )
  }
}

export default Register
