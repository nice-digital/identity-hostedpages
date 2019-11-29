import React from 'react';
import { Alert } from "@nice-digital/nds-alert";
import { Input } from '@nice-digital/nds-forms';
import { NavLink, Link } from 'react-router-dom';
import { isDomainInUsername, hideNav } from '../../helpers';
import AuthApi from '../../services/AuthApi';
import Nav from "../Nav/Nav";
import './ForgotPassword.scss';

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props)
    this.auth = new AuthApi()
    this.state = {
      email: null,
      error: null,
      loading: false,
      isAD: false
    }
  }

  requestErrorCallback = err =>
    this.setState({
      error: err.description || err.error_description,
      loading: false
    })

  forgotPassword = (e) => {
    if (e) e.preventDefault()
    try {
      this.setState({ loading: true }, () => {
        const { email } = this.state
        this.auth.forgotPassword(email, this.requestErrorCallback, this.props.history)
      })
    } catch (err) {
      this.setState({ loading: false })
    }
  }

  handleChange = ({ target: { name, value } }) => {
    let isAD = null;
    if (name === 'email') {
      isAD = isDomainInUsername(value);
    }
    this.setState(
      {
        [name]: value,
        error: null,
        isAD,
      },
      this.isValid
    )
  }

  render() {
    hideNav()
    const { error, loading, email, isAD } = this.state
    return (
      <div>
        <Nav/>
        <h3>Reset your password</h3>
        <p class="lead">
          Enter the email address you registered with in the box below and click the reset button. We'll send you an email with a link to help you reset your password.
        </p>
        <form className="">
            {error && <Alert type="error">{error}</Alert>}
            <Input
              data-qa-sel="forgotPassword-email"
              label="Email"
              id="email"
              name="email"
              unique="email"
              type="email"
              placeholder="eg: your.name@example.com..."
              onChange={this.handleChange}
            />
          {isAD && (
            <Alert type="info">
              <NavLink data-qa-sel="Signin-link-login" to="/" activeclassname="activeRoute">Sign in</NavLink> using your NICE email address and password. 
            </Alert>
          )}
          {!loading ? (
            <button
              data-qa-sel="forgotPassword-button"
              className="btn btn--cta"
              onClick={this.forgotPassword}
              disabled={!email || isAD }
            >
              Reset password
            </button>
          ) : (
            'Loading...'
          )}
        </form>
        <Link data-qa-sel="forgotPassword-link-to-login" to="/">
          Return to sign in
        </Link>
      </div>
    )
  }
}

export default ForgotPassword
