import React, { Component } from "react";
import { Alert } from '@nice-digital/nds-alert';
import pathOr from 'ramda/src/pathOr';
import { Input } from '@nice-digital/nds-forms';
import { FormGroup } from '@nice-digital/nds-form-group';
import qs from 'qs';
import { Link } from "react-router-dom";
import Nav from "../Nav/Nav";
import { isDomainInUsername, showNav} from '../../helpers';
import AuthApi from '../../services/AuthApi';
import { auth as authOpts } from '../../services/constants';
import './Login.scss';

class Login extends Component {
  constructor(props) {
    super(props);
    this.auth = new AuthApi();
    this.state = {
      username: null,
      password: null,
      error: null,
      loading: false,
      isAD: false,
      connection: authOpts.connection,
      showGoogleLogin: false,
      activationEmailSent: false
    };
    this.querystring = qs.parse(document.location.search, {
      ignoreQueryPrefix: true
    });
    this.continue = true
  }

  componentDidMount() {
    this.querystring = qs.parse(document.location.search, {
      ignoreQueryPrefix: true
    });
    this.auth.fetchClientSettings().then(() => {
      this.googleConnection = pathOr(
        null,
        ['strategies', 'google-oauth2', 'connectionName'],
        window.Auth0
      );
      this.ADConnection = pathOr(
        null,
        ['strategies', 'waad', 'connectionName'],
        window.Auth0
      );
      this.setState(
        { showGoogleLogin: !!this.googleConnection },
        this.showAuth0RulesError
      )
    })
  }

  showAuth0RulesError = () => {
    this.setState({ error: this.querystring.myerror })
  };

  resendVerificationEmail = (e) => {
    if (e) e.preventDefault()
    const callback = err =>
      this.setState({ activationEmailSent: !err, error: err })
    try {
      this.auth.resendVerificationEmail(this.querystring.userid, callback)
    } catch (err) {
      console.log(JSON.stringify(err))
    }
  };

  login = (e, isGoogle) => {
    if (e) e.preventDefault()
    const requestErrorCallback = err =>
      this.setState(
        {
          error: err.description || err.error_description,
          loading: false
        },
        console.log(JSON.stringify(err))
      );
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
  };

  handleChange = ({ target: { name, value } }) => {
    let isAD = null;
    if (name === 'username') {
      isAD = isDomainInUsername(value);
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
  };

  render() {
    showNav();
    const {
      error,
      loading,
      isAD,
      showGoogleLogin,
      activationEmailSent
    } = this.state
    const { myerrorcode } = this.querystring;

    return (
      <div>
        <Nav/>
        <form className="">
          <FormGroup legend="Personal information">
            {error && (
              <Alert type="error">
                {error}{' '}
                {myerrorcode === 'user_not_verified' ? (
                  <button href="#" onClick={this.resendVerificationEmail}>
                    Resend activation email
                  </button>
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
              autoComplete="username"
            />
            {!isAD && (
              <Input
                data-qa-sel="login-password"
                name="password"
                type="password"
                label="Password"
                onChange={this.handleChange}
                autoComplete="current-password"
              />
            )}
          </FormGroup>
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
                  <span className="buttonLabel">Or </span>
                  <img
                    className="iconBtn-icon"
                    alt="Sign in with google"
                    src={ process.env.PUBLIC_URL + "/images/btn_google_signin_light_normal_web.png"}
                  />
                </button>
              )}
            </div>
          ) : (
            'Loading...'
          )}
        </form>
        <Link className="forgotPasswordLink" data-qa-sel="forgotPassword-link" to="/forgotPassword">
          Forgot password?
        </Link>
      </div>
    )
  }
}

export default Login