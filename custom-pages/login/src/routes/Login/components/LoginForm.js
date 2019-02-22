import React from 'react'
import qs from 'qs'
import AuthApi from '../../../services/AuthApi'
// import Logo from '../assets/logo.png'

import classes from './LoginForm.css'

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
      <form className={`panel ${classes.mainpanel}`}>
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
      </form>
    )
  }
}

export default Login
