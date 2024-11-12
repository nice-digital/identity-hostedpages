import React, { Component }  from 'react';
import { Alert } from '@nice-digital/nds-alert';
import { Input } from '@nice-digital/nds-input';
import { FormGroup } from '@nice-digital/nds-form-group';
import { Checkbox } from '@nice-digital/nds-checkbox';
import { validateRegisterFields, isDomainInUsername, scrollToMyRef } from '../../helpers';
import AuthApi from '../../services/AuthApi';
import './Register.scss';
import { NavLink } from "react-router-dom";
import { auth as authOpts } from '../../services/constants';

class Register extends Component {
  constructor(props) {
    super(props)
    this.auth = new AuthApi()
    this.state = {
      tAndC: false,
      allowContactMe: false,
      email: null,
      password: null,
      confirmPassword: null,
      name: null,
      surname: null,
      errors: {
        email: false,
        password: false,
        confirmPassword: false,
        name: false,
        surname: false,
        tAndC: false
      },
      showAlert: false,
      serverSideError: null,
      loading: false,
      isAD: false
    }
    
    this.formRefs = Object.keys(this.state.errors).reduce((accumulator, error) => {
      return Object.assign(accumulator, {
        [error]: React.createRef()
      });
    }, {});
    this.errorAlertContainer = React.createRef();
  }

  scrollIntoErrorPanel = () => {
    this.errorAlertContainer.current.scrollIntoView({ behavior: 'smooth', block: 'start' });    
    this.errorAlertContainer.current.querySelector('a').focus();
    return true;
  };

  register = (event) => {
    if (event) event.preventDefault();
    // Trigger field validation before submission/registration.
    // Set errors if fields are empty on invalid.
    this.setState(function(state){
      const tests = validateRegisterFields(state);

      return {
        errors: {
          email: !state.email || tests.email(),
          password: !state.password || tests.password(),
          confirmPassword: !state.confirmPassword || tests.confirmPassword(),
          name: !state.name || tests.name(),
          surname: !state.surname || tests.surname(),
          tAndC: !state.tAndC
        }
      };
    }, () => {
      if (this.isValidRegistration()) {
        this.doRegistration();
      } else {
        this.setState({ showAlert: true, serverSideError: null }, this.scrollIntoErrorPanel);
      }
    });
  };

  isValidRegistration = () => {
    let hasErrors = Object.keys(this.state.errors).map(itm => this.state.errors[itm]).reduce((defaultErrorValue, hasError) => {
      return defaultErrorValue || hasError
    }, false);
    return !hasErrors;
  };

  doRegistration = () => {
    const serverErrorCallback = err => this.setState(function() {
      console.error(err);

      return {
        serverSideError: err.description || err.name, 
        loading: false
      }
    }, this.scrollIntoErrorPanel);

    try {
      this.setState({ showAlert: false, loading: true });
      let { email, password, name, surname, tAndC, allowContactMe } = this.state;
      // acceptedTerms and allowContactMe need to be strings due to
      // auth0 only accepting strings in the user_metadata sent to
      // the user signup endpoint
      this.auth.register(
        email,
        password,
        name,
        surname,
        tAndC.toString(),
        allowContactMe.toString(),
        serverErrorCallback,
        this.props.history
      )
    } catch (err) {
      this.setState(function() {
        console.error(err);

        return {
          serverSideError: err.message || err.name, 
          loading: false
        }
      }, this.scrollIntoErrorPanel);
    }
  };

  handleCheckboxChange = (event) => {
    //event persistence for setState
    let name = event.target.name;
    let checked = event.target.checked;
    this.setState(function(state) {
      let errors = name === 'tAndC' ? { ...state.errors, tAndC: false } : state.errors;
      return {
        [name]: checked,
        errors
      };
    }, () =>{
      if (this.state.showAlert){
        this.validate();
      }
    });
  };

  handleChange = (event) => {
    //event persistence for setState
    let name = event.target.name,
      value = event.target.value;

    this.setState(function(state) {
      let isAD = (name === 'email') ? isDomainInUsername(value) : state.isAD;
      return {
        [name]: value,
        serverSideError: null,
        isAD,
        connection: isAD ? this.ADConnection : authOpts.connection
      };
    }, () => {
      if (this.state.showAlert){
        this.validate();
      }
    });
  };

  clearError = (event) => {
    let eventTargetName = event.target.name;

    this.setState(function(state) {
      return {
        errors: {...state.errors, [eventTargetName]: false},
        showAlert: false,
        serverSideError: null
      };
    });
  };

  validate = () => {
    // Validate fields as you go. It doesn't check if fields are empty.
    // That's only done on submission

    const tests = validateRegisterFields(this.state);

    this.setState(function(state) {
      const stateToSet = {
        errors: {
          email: state.email ? tests.email(state.email) : state.errors.email,
          password: state.password ? tests.password() : state.errors.password,
          confirmPassword: state.confirmPassword ? tests.confirmPassword() : state.errors.confirmPassword,
          name: state.name ? tests.name() : state.errors.name,
          surname: state.surname ? tests.surname() : state.errors.surname,
          tAndC: state.errors.tAndC
        }
      };
      const showAlert = Object.entries(stateToSet.errors).some((error) => error[1]);
      return Object.assign(stateToSet, { showAlert: showAlert});
    });
  };

  stripFieldNameFromErrorMessage = (errorMessage, requiredMessage) => {
    // removes the 'Email -' portion of the below error messages
    
    if (errorMessage.search(requiredMessage) > 0) {
      return requiredMessage;
    }
    return errorMessage;
  };

  render() {
    const {
      allowContactMe,
      tAndC,
      errors,
      showAlert,
      email,
      password,
      confirmPassword,
      name,
      surname,
      loading,
      isAD,
      serverSideError
    } = this.state;

    const requiredMessage = 'This field is required';

    const errorMessages = {
      email: !email ? `Email - ${requiredMessage}` : 'Email address is in an invalid format',
      password: !password ? `Password - ${requiredMessage}` : 'Please provide a password with a minimum of 14 characters and contains at least 1 of all 3 following types of characters: upper case letter, number, special character (e.g. !@#$%^&*)',
      confirmPassword: !confirmPassword ? `Confirm password - ${requiredMessage}` : 'Password doesn\'t match',
      name: !name ? `First name - ${requiredMessage}` : 'First name should contain letters and should not exceed 100 characters',
      surname: !surname ? `Last name - ${requiredMessage}` : 'Last name should contain letters and should not exceed 100 characters',
      tAndC: 'You must accept Terms and Conditions to be able to create an account'      
    }

    return (
      <div>
        <h2> Create account </h2>
        <p className="lead"><NavLink
          data-qa-sel="Signin-link-login"
          to="/"
          activeclassname="activeRoute"
        >
          Sign in
        </NavLink> if you already have a NICE account.</p>
        <form className="">
          <p className="lead">
            Use your work email address if you have one.
          </p>
          <fieldset className="form-group">
            <legend className="form-group__legend">
              Personal information
	          </legend>
            <div ref={this.errorAlertContainer}>
              {showAlert && (
                <Alert
                  data-qa-sel="problem-alert-register"
                  type="error"
                  aria-labelledby="error-summary-title"
                  role="alert"
                >
                  <p className="lead">There is a problem</p>

                  <ul>                    
                    {Object.keys(errors).map((errorName, idx) => {
                      if (errors[errorName]) {
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
                  </ul>
                </Alert>
              )}
              {serverSideError && (
                <Alert
                  data-qa-sel="problem-alert-register-serverError"
                  type="error"
                  aria-labelledby="error-server-title"
                  role="alert"
                >
                  <div className="lead">
                    {serverSideError === 'The user already exists.' ?
                      <div>
                        An account already exists for this email address.<br/>
                        <NavLink data-qa-sel="Signin-link-login" to="/" activeclassname="activeRoute">
                          Sign in
                        </NavLink>
                        {/* <Link className="forgotPasswordRegister" data-qa-sel="forgotPassword-register" to="/forgotPassword">
                          Forgot password?
                        </Link> */}
                      </div>
                      :
                      <div>
                        {serverSideError}
                      </div>
                    }
                  </div>
                </Alert>
              )}
            </div>
            <Input
              data-qa-sel="email-register"
              label="Email"
              id="email" 
              name="email"
              unique="email"
              type="email"
              placeholder="eg: your.name@example.com..."
              value={this.state.value}
              onChange={this.handleChange}
              error={errors.email}
              errorMessage={this.stripFieldNameFromErrorMessage(errorMessages.email, requiredMessage)}
              onBlur={this.validate}
              //onFocus={this.clearError}
              aria-describedby="email-error"
              inputRef={this.formRefs['email']}
            />
            {isAD && (
            <Alert type="caution" role="alert">
              You already have an account. <NavLink data-qa-sel="Signin-link-login" to="/" activeclassname="activeRoute">Sign in</NavLink> using your NICE email address and password.
            </Alert>
            )}
            <Input
              data-qa-sel="password-register"
              name="password"
              unique="password"
              type="password"
              label="Password"
              onChange={this.handleChange}
              error={errors.password}
              errorMessage={this.stripFieldNameFromErrorMessage(errorMessages.password, requiredMessage)}
              onBlur={this.validate}
              //onFocus={this.clearError}
              aria-describedby="password-error"
              autoComplete="new-password"
              inputRef={this.formRefs['password']}
            />
            <Input
              data-qa-sel="confirm-password-register"
              name="confirmPassword"
              unique="confirmPassword"
              type="password"
              label="Confirm password"
              onChange={this.handleChange}
              error={errors.confirmPassword}
              errorMessage={this.stripFieldNameFromErrorMessage(errorMessages.confirmPassword, requiredMessage)}
              onBlur={this.validate}
              //onFocus={this.clearError}
              aria-describedby="confirmPassword-error"
              autoComplete="new-password"
              inputRef={this.formRefs['confirmPassword']}
            />
            <Input
              data-qa-sel="name-register"
              name="name"
              unique="firstName"
              label="First name"
              onChange={this.handleChange}
              error={errors.name}
              errorMessage={this.stripFieldNameFromErrorMessage(errorMessages.name, requiredMessage)}
              onBlur={this.validate}
              //onFocus={this.clearError}
              aria-describedby="name-error"
              inputRef={this.formRefs['name']}
            />
            <Input
              data-qa-sel="surname-register"
              name="surname"
              unique="lastName"
              label="Last name"
              onChange={this.handleChange}
              error={errors.surname}
              errorMessage={this.stripFieldNameFromErrorMessage(errorMessages.surname, requiredMessage)}
              onBlur={this.validate}
              //onFocus={this.clearError}
              aria-describedby="surname-error"
              inputRef={this.formRefs['surname']}
            />
            </fieldset>
            <p className="lead">We use cookies:</p>
            <ul>
              <li>
                To monitor usage of the NICE websites in order to improve our
                services
              </li>
              <li>
                To remember what you view on our websites and enable us to tailor
                our services to you.
              </li>
            </ul>
            <FormGroup 
              legend="Terms and conditions" 
              name="tAndC" 
              groupError={errors.tAndC ? errorMessages.tAndC : null}
            >
            <div ref={this.formRefs['tAndC']}>
                <Checkbox
                  data-qa-sel="tc-checkbox-register"
                  name="tAndC"
                  label="I agree to NICE's terms and conditions, and the use of cookies."
                  checked={tAndC}
                  onChange={this.handleCheckboxChange}
                  onBlur={this.validate}
                  error={errors.tAndC}
                  aria-describedby="tandc-error"
                  value="agree"
                />
                <a href="https://www.nice.org.uk/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="ml--f">Terms and conditions <span className="visually-hidden">(opens in a new tab)</span></a>
              </div>
            </FormGroup>
            <FormGroup 
              legend="Join our Audience Insight Community" 
              name="allowContactMe"
            >
              <Checkbox                
                data-qa-sel="ai-checkbox-register"
                name="allowContactMe"
                checked={allowContactMe}
                label="Our insight community helps us improve our products and services. "
                onChange={this.handleCheckboxChange}
                value="agree"
              />
              <a href="https://www.nice.org.uk/get-involved/help-us-improve" target="_blank" rel="noopener noreferrer" className="ml--f">Find out more about the Audience Insight Community <span className="visually-hidden">(opens in a new tab)</span></a>
            </FormGroup>

            <Alert>
              The information you provide on this form will be used by us to
              administer your NICE account. For more information about how we
              process your data, see our{' '}
              <a
                href="https://www.nice.org.uk/privacy-notice"
                target="_blank"
                rel="noopener noreferrer"
              >
                privacy notice
              </a>
            </Alert>

          {!loading ? (
            <button
              data-qa-sel="Register-button"
              className="btn btn--cta"
              onClick={e => this.register(e)}
            >
              Register
            </button>
          ) : (
            'Loading...'
          )}
        </form>
      </div>
    )
  }
}

export default Register
