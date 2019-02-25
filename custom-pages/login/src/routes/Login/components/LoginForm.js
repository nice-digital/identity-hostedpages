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
      password: null
    }
  }

  login = (e) => {
    e.preventDefault()
    const { username, password } = this.state
    this.auth.login(username, password)
  }

  handleChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value
    })
  }

  render() {
    return (
      <form className="panel mainpanel">
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
        <a href="#" className="btn btn--cta" onClick={this.login}>
          Sign in
        </a>
      </form>
    )
  }
}

export default Login
