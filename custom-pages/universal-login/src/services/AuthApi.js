/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import Auth0 from 'auth0-js'
import qs from 'qs'
import { auth as authOpts, urls } from './constants'
import { ensureTrailingSlash } from '../helpers'

const __DEV__ = global.__DEV__ || false
export default class AuthApi {
  static instance = null
  constructor() {
    if (!window.config) {
      window.config = {}
    }
    window.config.extraParams = window.config.extraParams || { redirectURI: undefined }
    this.opts = {
      ...window.config.extraParams,
      domain: authOpts.domain,
      clientID: authOpts.clientID,
      leeway: 1,
      popup: false,
      responseType: 'code',
      scope: authOpts.scope,
      redirect: true
      // overrides: {
      //   // eslint-disable-next-line
      //   __tenant: config.auth0Tenant,
      //   // eslint-disable-next-line
      //   __token_issuer: config.authorizationServer.issuer
      // }
    }
    this.params = Object.assign(this.opts, window.config.internalOptions)
    this.instance = new Auth0.WebAuth(this.params)
  }

  createAuth0Namespace = (promiseResolver) => {
    window.Auth0 = {
      setClient: (res) => {
        window.Auth0 = {
          ...window.Auth0,
          internalSettings: res,
          strategies: this.getStategies(res.strategies)
        }
        promiseResolver()
      }
    }
  }

  fetchClientSettings = () =>
    new Promise((resolver) => {
      if (window.config) {
        const cdnBaseUrl = __DEV__
          ? authOpts.auth0CDN
          : window.config.clientConfigurationBaseUrl
        const source = `${ensureTrailingSlash(cdnBaseUrl)}client/${
          authOpts.clientID
        }.js?t${+new Date()}`
        this.createAuth0Namespace(resolver)
        const scriptTag = document.createElement('script')
        scriptTag.src = source
        document.body.appendChild(scriptTag)
      }
    })

  getStategies = strategies =>
    strategies.reduce((acc, curr) => {
      acc[curr.name] = {
        ...curr,
        domainString: curr.connections.length
          ? curr.connections[0].domain
          : null,
        connectionName: curr.connections.length
          ? curr.connections[0].name
          : null
      }
      return acc
    }, {})

  login(connection, username, password, errorCallback, resumeAuthState) {
    try {
      const redirectUri = window.config.extraParams.redirectURI
      let options
      let method
      if (connection === authOpts.connection) {
        options = {
          ...this.params,
          realm: connection,
          username,
          password
        }
        method = 'login'
      } else {
        options = {
          ...this.params,
          connection,
          username,
          sso: true,
          login_hint: username,
          response_mode: 'form_post'
        }
        method = 'authorize'
      }
      if (redirectUri) {
        options.redirect_uri = redirectUri
      }
      if (!resumeAuthState) {
        this.instance[method](options, (err) => {
          if (err) {
            if (errorCallback) {
              setTimeout(() => errorCallback(err))
            }
            console.log(JSON.stringify(err))
          }
        })
      } else {
        const GETOptions = qs.stringify(
          { ...options, state: resumeAuthState },
          { addQueryPrefix: true }
        )
        fetch(`/continue${GETOptions}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        })
          .then((res) => {
            if (res.status === 200) {
              document.location = redirectUri
            } else if (errorCallback) {
              setTimeout(() => errorCallback(res))
            }
          })
          .catch((err) => {
            if (errorCallback) {
              setTimeout(() => errorCallback(err))
            }
          })
      }
    } catch (err) {
      console.log(JSON.stringify(err))
    }
  }

  submitWSForm = (responseForm) => {
    const div = document.createElement('div')
    div.innerHTML = responseForm
    const formElement = document.body.appendChild(div).children[0]
    formElement.submit()
  }

  forgotPassword(email, errorCallback, history) {
    const options = {
      ...this.params,
      connection: authOpts.connection,
      responseType: authOpts.responseType,
      email
    }
    this.instance.changePassword(options, (err) => {
      if (err) {
        if (errorCallback) {
          setTimeout(() => errorCallback(err), 5)
        }
        return false
      }
      history.push('/forgotsuccess');
      return true
    })    
  }

  resetPassword = (password, errorCallback, history) => {
    const callback = (res) => {
      if (res.status === 200) {
        history.push('/resetsuccess');
      } else if (errorCallback) {
        setTimeout(() => errorCallback('There has been an issue'))
      }
    }
    const catchCallback = (err) => {
      if (errorCallback) {
        setTimeout(() => errorCallback('There has been an issue'))
      }
      console.log(JSON.stringify(err))
    }

    if (window.rpConfig) {
      const data = {
        connection: authOpts.connection,
        responseType: authOpts.responseType,
        email: window.rpConfig.email,
        _csrf: window.rpConfig.csrf_token,
        ticket: window.rpConfig.ticket,
        newPassword: password,
        confirmNewPassword: password
      }
      
      fetch('/lo/reset', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(callback)
        .catch(catchCallback)      
    }
  }

  register(email, password, name, surname, allowContactMe, errorCallback, history) {
    const options = {
      ...this.params,
      connection: authOpts.connection,
      responseType: authOpts.responseType,
      email,
      password,
      user_metadata: {
        name,
        surname,
        allowContactMe
      }
    }
    console.log(options);
    this.instance.signup(options, (err) => {
      if (err) {
        console.log(err);
        if (errorCallback) {
          setTimeout(() => errorCallback(err))
        }
        return false
      }
      history.push('/regsuccess');
      return true
    })
  }

  resendVerificationEmail = (userId, callerCallback) => {
    console.log('resending email to: ', userId)
    const callback = (res) => {
      console.log(JSON.stringify(res));
      console.log(res.status);
      if (res.status === 200) {
        setTimeout(() => callerCallback(null)) // this will reset the error
      } else {
        setTimeout(() =>
          callerCallback('something has gone wrong when sending the email'))
      }
    }
    const catchCallback = (err) => {
      setTimeout(() =>
        callerCallback('something has gone quite wrong when sending the email'))
      console.log(JSON.stringify(err))
    }

    const data = {
      // ...this.params,
      user_id: userId,
      client_id: authOpts.clientID
    }
    console.log('about to resend verification email');
    console.log(`url: ${urls.resendVerificationEmail} body: ${JSON.stringify(data)}`);      
    fetch(urls.resendVerificationEmail, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(callback)
      .catch(catchCallback)
  }
}