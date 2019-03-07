import React from 'react'
import Alert from '@nice-digital/nds-alert'
import { Input, Fieldset } from '@nice-digital/nds-forms'
// local imports
import { showNav } from '../../../util'
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
      valid: false,
      isAD: false,
      connection: authOpts.connection
    }
  }

  requestErrorCallback = err => this.setState({ error: err, loading: false })

  login = (e) => {
    if (e) e.preventDefault()
    try {
      this.setState({ loading: true }, () => {
        const { username, password, connection } = this.state
        this.auth.login(
          connection,
          username,
          password,
          this.requestErrorCallback
        )
      })
    } catch (err) {
      // console.log(err)
      this.setState({ loading: false })
    }
  }

  isValid() {
    const { username, password, isAD } = this.state
    this.setState({ valid: (username && password) || (username && isAD) })
  }

  isDomainInUsername = () => {
    const { username } = this.state
    try {
      const domain =
        window.Auth0 && window.Auth0.strategies && window.Auth0.strategies.waad
          ? window.Auth0.strategies.waad.connections[0].domain
          : null
      if (username && domain && typeof domain === 'string') {
        const isAD = username.toLowerCase().indexOf(domain.toLowerCase()) !== -1
        const connection = window.Auth0.strategies.waad.connections[0].name
        this.setState(
          {
            isAD,
            connection: isAD ? connection : this.state.connection
          },
          this.isValid
        )
      } else {
        this.isValid()
      }
    } catch (e) {
      this.isValid()
    }
  }

  handleChange = ({ target: { name, value } }) => {
    this.setState(
      {
        [name]: value,
        error: null
      },
      this.isDomainInUsername
    )
  }

  render() {
    showNav()
    const {
      error, loading, valid, isAD
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
            <button
              data-qa-sel="login-button"
              className="btn btn--cta"
              onClick={this.login}
              disabled={!valid}
            >
              Sign in
            </button>
          ) : (
            'Loading...'
          )}
        </Fieldset>
      </form>
    )
  }
}

export default Login
