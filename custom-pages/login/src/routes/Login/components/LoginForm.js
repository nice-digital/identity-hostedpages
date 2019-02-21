import React from 'react'
import auth0 from 'auth0-js'
import qs from 'qs'
import CordovaAuth0Plugin from 'auth0-js/dist/cordova-auth0-plugin.min'
// import Logo from '../assets/logo.png'
import { auth } from '../../../services/constants'
import classes from './LoginForm.css'

export class Login extends React.Component {
  constructor(props) {
    super(props)
    this.opts = {
      domain: auth.domain,
      clientID: auth.clientID,
      plugins: [new CordovaAuth0Plugin()],
      leeway: 1,
      audience: '',
      responseMode: 'query',
      popup: false,
      responseType: auth.responseType,
      scope: auth.scope,
      redirect: true,
      realm: 'Username-Password-Authentication',
      connection: 'Username-Password-Authentication'
    }
    this.redirectUri = null
    this.state = {
      username: null,
      password: null
    }
  }

  componentDidMount() {
    const query = qs.parse(document.location.search, { ignoreQueryPrefix: true })
    this.redirectUri = query.redirect_uri ? query.redirect_uri : document.location.origin
    this.auth0 = new auth0.WebAuth(this.opts)
  }

  login = (e) => {
    e.preventDefault()
    const { username, password } = this.state
    console.log(username, password, this.redirectUri)
    // this.auth0.authorize(
    this.auth0.login(
      {
        ...this.opts,
        redirectUri: this.redirectURI,
        username: 'alessio.fimognari@amido.com',
        password: 'Password01!'
      },
      (err) => {
        if (err) {
          console.error('could not login')
          return false
        }
        console.log('I am in, it should redirect')
        return true
      }
    )
  }

  handleChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value
    })
  }

  render() {
    return (
      <div className={`panel ${classes.mainpanel}`}>
        {/* <img alt="nice logo" className={classes.logo} src={Logo} /> */}
        <input
          name="username"
          type="email"
          placeholder="eg: your.name@example.com..."
          onChange={this.handleChange}
        />
        <input name="password" type="password" onChange={this.handleChange} />
        <a href="#" className="btn" onClick={this.login}>
          Sign in
        </a>
      </div>
    )
  }
}

export default Login
