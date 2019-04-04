import React from 'react'
import Alert from '@nice-digital/nds-alert'
import pathOr from 'ramda/src/pathOr'
import { Input, Fieldset } from '@nice-digital/nds-forms'
import qs from 'qs'
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
      showGoogleLogin: false,
      activationEmailSent: false
    }
    this.querystring = qs.parse(document.location.search, {
      ignoreQueryPrefix: true
    })
    this.continue = true
  }

  componentDidMount() {
    this.querystring = qs.parse(document.location.search, {
      ignoreQueryPrefix: true
    })
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
      this.setState(
        { showGoogleLogin: !!this.googleConnection },
        this.showAuth0RulesError
      )
    })
  }

  showAuth0RulesError = () => {
    this.setState({ error: this.querystring.myerror })
  }

  resendVerificationEmail = (e) => {
    if (e) e.preventDefault()
    const callback = err =>
      this.setState({ activationEmailSent: !err, error: err })
    try {
      this.auth.resendVerificationEmail(this.querystring.userid, callback)
    } catch (err) {
      console.log(JSON.stringify(err))
    }
  }

  login = (e, isGoogle) => {
    if (e) e.preventDefault()
    const requestErrorCallback = err =>
      this.setState(
        {
          error: err.description || err.error_description,
          loading: false
        },
        console.log(JSON.stringify(err))
      )
    try {
      this.setState({ loading: true }, () => {
        const { username, password, connection } = this.state
        const loginConnection = isGoogle ? this.googleConnection : connection
        const isResumingAuthState =
          this.querystring.myerrorcode &&
          this.querystring.myerrorcode === 'user_not_verified'
            ? this.continue && this.querystring.state
            : null
        this.auth.login(
          loginConnection,
          username,
          password,
          requestErrorCallback,
          isResumingAuthState
        )
      })
    } catch (err) {
      console.log(JSON.stringify(err))
      this.setState({ loading: false, error: 'Something has gone wrong.' })
    }
  }

  handleChange = ({ target: { name, value } }) => {
    let isAD = null
    if (name === 'username') {
      isAD = isDomainInUsername(value)
      if (this.querystring.myerrorcode && this.querystring.email !== value) {
        this.continue = false
      }
    }
    this.setState({
      [name]: value,
      // error: null,
      isAD,
      connection: isAD ? this.ADConnection : authOpts.connection
    })
  }

  render() {
    showNav()
    const {
      error,
      loading,
      isAD,
      showGoogleLogin,
      activationEmailSent
    } = this.state
    const { myerrorcode } = this.querystring

    return (
      <form className="">
        <Fieldset legend="Personal information">
          {error && (
            <Alert type="error">
              {error}{' '}
              {myerrorcode === 'user_not_verified' ? (
                <a href="#" onClick={this.resendVerificationEmail}>
                  Resend activation email
                </a>
              ) : null}
            </Alert>
          )}
          {activationEmailSent && (
            <Alert type="success">An activation email has been sent!</Alert>
          )}
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
        </Fieldset>
        {!loading ? (
          <div>
            <button
              data-qa-sel="login-button"
              className="btn btn--cta"
              onClick={e => this.login(e, false)}
              // disabled={!username}
            >
              Sign in
            </button>
            {showGoogleLogin && (
              <button
                data-qa-sel="login-button-social"
                className="iconBtn social"
                style={{ float: 'right' }}
                onClick={e => this.login(e, true)}
              >
                <span className="buttonLabel">Or sign in with</span>
                <img
                  className="iconBtn-icon"
                  alt="Sign in with google"
                  src="https://d2i72ju5buk5xz.cloudfront.net/gsc/OLZUJZ/b2/91/66/b29166a7cbbb4366a0489f51425d4eef/images/sign_in_nice_org_v1/u1197.png?token=e0f2a5088357cc15a5a882ace3c75abd"
                />
              </button>
            )}
          </div>
        ) : (
          'Loading...'
        )}
      </form>
    )
  }
}

export default Login
