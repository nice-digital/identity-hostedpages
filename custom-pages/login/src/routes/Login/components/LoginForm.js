import React from 'react'
import auth0 from 'auth0-js'
import Logo from '../assets/logo.png'
import classes from './LoginForm.css'

export class Login extends React.Component {
  constructor(props) {
    super(props)
    this.auth0 = new auth0.WebAuth({
      domain: 'dev-nice-identity.auth0.com',
      clientID: 'RMpYVjKE_B85IO6Euc2i3IstVAstrEHK',
      // redirectUri: '',
      scope: 'openid profile email'
    })
  }

  doSomething = (e) => {
    e.preventDefault()
    console.log('button pressed')
    this.auth0.client.login(
      {
        realm: '',
        username: 'alessio.fimognari@amido.com',
        password: 'Password01!'
      },
      () => console.log('I have login!')
    )
  }
  render() {
    return (
      <div className={`panel ${classes.mainpanel}`}>
        {/* <img alt="nice logo" className={classes.logo} src={Logo} /> */}
        <input name="email" type="email" placeholder="eg: your.name@example.com..." />
        <input name="password" type="password" />
        <a href="#" className="btn" onClick={e => this.doSomething(e)}>
          Sign in
        </a>
      </div>
    )
  }
}

export default Login
