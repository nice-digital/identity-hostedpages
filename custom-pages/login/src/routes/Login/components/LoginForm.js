import React from 'react'
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
      loading: false
    }
  }

  login = async (e) => {
    e.preventDefault()
    this.setState({ loading: true })
    const { username, password } = this.state
    try {
      await this.auth.login(username, password)
      this.setState({ loading: false })
    } catch (err) {
      this.setState({ error: err.message, loading: false })
    }
  }

  handleChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value
    })
  }

  render() {
    return (
      <form className="panel mainpanel">
        {this.state.error && <div>{this.state.error}</div>}
        {/* <img alt="nice logo" className={classes.logo} src={Logo} /> */}
        <label id="usernameLabel" htmlFor="username">
          Username
          <br />
          <input
            id="username"
            name="username"
            type="email"
            placeholder="eg: your.name@example.com..."
            onChange={this.handleChange}
          />
        </label>
        <label htmlFor="password">
          Password
          <br />
          <input name="password" type="password" onChange={this.handleChange} />
        </label>
        {!this.state.loading ? (
          <button className="btn btn--cta" onClick={this.login}>
            Sign in
          </button>
        ) : (
          'Loading...'
        )}
      </form>
    )
  }
}

export default Login
