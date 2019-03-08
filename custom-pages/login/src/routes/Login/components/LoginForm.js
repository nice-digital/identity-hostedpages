import React from 'react'
import Alert from '@nice-digital/nds-alert'
import pathOr from 'ramda/src/pathOr'
import { Input, Fieldset } from '@nice-digital/nds-forms'
// local imports
import { showNav, isDomainInUsername } from '../../../util'
import AuthApi from '../../../services/AuthApi'
import { auth as authOpts } from '../../../services/constants'
// import Logo from '../assets/logo.png'

import './LoginForm.scss'

export class Login extends React.Component {
  constructor(props) {
    super(props)
    this.auth = new AuthApi()
    this.state = {
      username: null,
      password: null,
      error: null,
      loading: false,
      isAD: false,
      connection: authOpts.connection,
      showGoogleLogin: false
    }
  }
  componentDidMount() {
    this.auth.fetchClientSettings().then(() => {
      this.googleConnection = pathOr(
        null,
        ['strategies', 'google-oauth2', 'connectionName'],
        window.Auth0
      )
      this.ADConnection = pathOr(
        null,
        ['strategies', 'waad', 'connectionName'],
        window.Auth0
      )
      this.setState({ showGoogleLogin: !!this.googleConnection })
    })
  }

  login = (e, isGoogle) => {
    if (e) e.preventDefault()
    const requestErrorCallback = err =>
      this.setState({ error: err, loading: false })
    try {
      this.setState({ loading: true }, () => {
        const { username, password, connection } = this.state
        const loginConnection = isGoogle ? this.googleConnection : connection
        this.auth.login(
          loginConnection,
          username,
          password,
          requestErrorCallback
        )
      })
    } catch (err) {
      // console.log(err)
      this.setState({ loading: false })
    }
  }

  handleChange = ({ target: { name, value } }) => {
    let isAD = null
    if (name === 'username') {
      isAD = isDomainInUsername(value)
    }
    this.setState({
      [name]: value,
      error: null,
      isAD,
      connection: isAD ? this.ADConnection : this.state.connection
    })
  }

  render() {
    showNav()
    const {
      username, error, loading, isAD, showGoogleLogin
    } = this.state

    return (
      <form className="">
        <Fieldset legend="Personal information">
          {error && <Alert type="error">{error}</Alert>}
          <Input
            data-qa-sel="login-email"
            label="Email"
            id="username"
            name="username"
            type="email"
            placeholder="eg: your.name@example.com..."
            onChange={this.handleChange}
          />
          {!isAD && (
            <Input
              data-qa-sel="login-password"
              name="password"
              type="password"
              label="Password"
              onChange={this.handleChange}
            />
          )}
          {!loading ? (
            <div>
              <button
                data-qa-sel="login-button"
                className="btn btn--cta"
                onClick={this.login}
                disabled={!username}
              >
                Sign in
              </button>
              {showGoogleLogin && (
                <button
                  data-qa-sel="login-button-social"
                  className="btn btn--cta social"
                  style={{ float: 'right' }}
                  onClick={e => this.login(e, true)}
                >
                  Sign in with Google
                </button>
              )}
            </div>
          ) : (
            'Loading...'
          )}
        </Fieldset>
      </form>
    )
  }
}

export default Login
