import React from 'react'
import Alert from '@nice-digital/nds-alert'
import { Input, Fieldset } from '@nice-digital/nds-forms'
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

  login = (e) => {
    e.preventDefault()
    this.setState({ loading: true }, () => {
      const { username, password } = this.state
      try {
        this.auth.login(username, password, err =>
          this.setState({ error: err.message, loading: false }))
        this.setState({ loading: false })
      } catch (err) {
        this.setState({ error: err.message, loading: false })
      }
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
    const { error, loading, valid } = this.state
    return (
      <form className="">
        <Fieldset legend="Personal Information">
          {error && <Alert type="error">{error}</Alert>}
          <Input
            label="Username"
            id="username"
            name="username"
            type="email"
            placeholder="eg: your.name@example.com..."
            onChange={this.handleChange}
          />
          <Input
            name="password"
            type="password"
            label="Password"
            onChange={this.handleChange}
          />
          {!loading ? (
            <button
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
