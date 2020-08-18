import React, { Component } from "react";
import { Alert } from '@nice-digital/nds-alert';
import { Input } from '@nice-digital/nds-input';
import qs from 'qs';
import { Link } from "react-router-dom";
import { isDomainInUsername, validateLoginFields, scrollToMyRef } from '../../helpers';
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
      clientSideErrors: {
        username: false,
        password: false
      },
      serverSideError: null,
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

    this.formRefs = Object.keys(this.state.clientSideErrors).reduce((accumulator, error) => {
      return Object.assign(accumulator, {
        [error]: React.createRef()
      });
    }, {});
  }

  componentDidMount() {
    this.querystring = qs.parse(document.location.search, {
      ignoreQueryPrefix: true
    });
    this.auth.fetchClientSettings().then(() => {
      // We are not using google to connect for now
      // this.googleConnection = window.Auth0.strategies && window.Auth0.strategies.google-oauth2 && window.Auth0.strategies.google-oauth2.connectionName || null;

      this.ADConnection = window.Auth0.strategies && window.Auth0.strategies.waad && window.Auth0.strategies.waad.connectionName || null;
      this.setState(
        { showGoogleLogin: !!this.googleConnection },
        this.showAuth0RulesError
      )
    });
    if (this.querystring.register === "true"){
      this.props.history.push("/register");
    }
  }

  showAuth0RulesError = () => {
    this.setState({ serverSideError: this.querystring.myerror })
  };

  resendVerificationEmail = (e) => {
    if (e) e.preventDefault()
    const callback = err =>
      this.setState({ activationEmailSent: !err, serverSideError: err })
    try {
      this.auth.resendVerificationEmail(this.querystring.userid, callback)
    } catch (err) {
      console.log(JSON.stringify(err))
    }
  };

  clientSideHasErrors = (clientSideErrors) =>{
    return clientSideErrors.username || clientSideErrors.password;
  }

  validate = () => {
    const tests = validateLoginFields(this.state);
    const clientSideErrors= {
        username: !this.state.username || tests.username(),
        password: tests.password()        
      };
    this.setState({ loading: false, clientSideErrors});
    return !this.clientSideHasErrors(clientSideErrors);
  }

  login = (e, isGoogle) => {
    if (e) e.preventDefault()
    const requestErrorCallback = err =>
      this.setState(
        {
          serverSideError: err.description || err.error_description,
          loading: false
        },
        console.log(JSON.stringify(err))
      );

    if (this.validate()){          
      try {
        this.setState({ loading: true, serverSideError: null }, () => {
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
        this.setState({ loading: false, serverSideError: 'Something has gone wrong.' })
      }
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
    }, () =>{
      if (this.clientSideHasErrors(this.state.clientSideErrors)){
        this.validate();
      }
    });    
  };

  render() {
    const {
      serverSideError,
      clientSideErrors,
      loading,
      isAD,
      showGoogleLogin,
      activationEmailSent
    } = this.state

    const showUserNotVerfiedMessage = (this.querystring && this.querystring.myerrorcode === 'user_not_verified');

    const requiredMessage = 'This field is required';

    const errorMessages = {
      username: `Email - ${requiredMessage}`,
      password: `Password - ${requiredMessage}`,
    }

    return (
      <div>
        <h2> Log in </h2>
        <p className="lead"><Link
          data-qa-sel="Signup-link-login"
          to="/register"
          activeclassname="activeRoute"
        >
          Create a NICE account
        </Link></p>
        <form className="">
          
            {(serverSideError || this.clientSideHasErrors(this.state.clientSideErrors)) && (
              <Alert type="error" role="alert" data-qa-sel="problem-alert-login">               
                <p className="lead">There is a problem</p>
                <ul>                    
                  {Object.keys(clientSideErrors).map((errorName, idx) => {
                    if (clientSideErrors[errorName]) {
                      return (
                        <li key={idx}>
                          <a href={`#${errorName}`} onClick={(e) => scrollToMyRef(this.formRefs[errorName], e)} aria-label="Go to error">
                              {errorMessages[errorName]}
                          </a>
                        </li>
                      );
                    }
                    return null;
                  })}
                  {serverSideError && (
                    <li>{serverSideError}</li>
                  )}
                </ul>                
                {' '}
                {showUserNotVerfiedMessage ? (
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
              name="username"
              data-qa-sel="login-email"
              label="Email"
              id="username"              
              unique="username"
              type="email"
              placeholder="eg: your.name@example.com..."
              onChange={this.handleChange}
              autoComplete="email"
              error={clientSideErrors.username}
              errorMessage={requiredMessage}
              inputRef={this.formRefs['username']}
            />
            {!isAD && (
              <Input
                data-qa-sel="login-password"
                name="password"
                type="password"
                unique="password"
                label="Password"
                onChange={this.handleChange}
                autoComplete="current-password"
                error={clientSideErrors.password}
                errorMessage={requiredMessage}
                inputRef={this.formRefs['password']}
              />
            )}

          {isAD && (
            <Alert type="info">
            When you select sign in you will be directed to another screen where you can sign in through Microsoft using your NICE email address and password.
            </Alert>
          )}

          {!loading ? (
            !showUserNotVerfiedMessage ? (
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
              // user is not verified. the login button is not going to work.
              <div/> 
            )
          ) : (
            'Loading...'
          )}
        </form>

        {!isAD && (
        <Link className="forgotPasswordLink" data-qa-sel="forgotPassword-link" to="/forgotPassword">
          Forgot password?
        </Link>
        )}
      </div>
    )
  }
}

export default Login
