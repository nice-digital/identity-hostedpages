import React from 'react'
import Alert from '@nice-digital/nds-alert'
import { Input, Fieldset } from '@nice-digital/nds-forms'
// local imports
import { showNav } from '../../../util'
import AuthApi from '../../../services/AuthApi'
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
      valid: false
    }
  }

  requestErrorCallback = err => this.setState({ error: err, loading: false })

  login = (e) => {
    e.preventDefault()
    this.setState({ loading: true }, () => {
      const { username, password } = this.state
      this.auth.login(username, password, this.requestErrorCallback)
    })
  }

  isValid() {
    const { username, password } = this.state
    this.setState({ valid: username && password })
  }

  handleChange = ({ target: { name, value } }) => {
    this.setState(
      {
        [name]: value,
        error: null
      },
      this.isValid
    )
  }

  render() {
    showNav()
    const { error, loading, valid } = this.state
    return (
      <form className="">
        <Fieldset legend="Personal Information">
          {error && <Alert type="error">{error}</Alert>}
          <Input
            data-qa-sel="login-email"
            label="Username"
            id="username"
            name="username"
            type="email"
            placeholder="eg: your.name@example.com..."
            onChange={this.handleChange}
          />
          <Input
            data-qa-sel="login-password"
            name="password"
            type="password"
            label="Password"
            onChange={this.handleChange}
          />
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
