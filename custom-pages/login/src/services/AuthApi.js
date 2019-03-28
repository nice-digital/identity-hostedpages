/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import Auth0 from 'auth0-js'
import ie8Fetch from 'fetch-ie8'
import qs from 'qs'
import { auth as authOpts, urls } from './constants'
import { isIE8, ensureTrailingSlash } from '../util'

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
      if (isIE8()) {
        this.loginIE8(options, method, errorCallback, resumeAuthState)
      } else if (!resumeAuthState) {
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

  loginIE8 = (data, method, errorCallback, resumeAuthState) => {
    const redirectUri = window.config.extraParams.redirectURI
    const isPost = method === 'login' && !resumeAuthState
    let authorizeUrl
    const options = {
      method: isPost ? 'POST' : 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }

    if (isPost) {
      options.body = JSON.stringify({
        ...data,
        connection: data.realm || data.connection,
        client_id: authOpts.clientID,
        redirect_uri: redirectUri,
        state: resumeAuthState || data.state
      })
    } else {
      const GETBody = {
        ...data,
        client_id: data.clientID,
        state: resumeAuthState || data.state
      }
      delete GETBody.clientID
      delete GETBody.redirectURI
      delete GETBody.username
      authorizeUrl = resumeAuthState ? '/contiue' : method
      authorizeUrl += qs.stringify(GETBody, { addQueryPrefix: true })
    }

    let url
    if (resumeAuthState) {
      url = authorizeUrl
    } else {
      url = method === 'login' ? '/usernamepassword/login' : authorizeUrl
    }
    ie8Fetch(url, options)
      .then((res) => {
        if (res.status === 200) {
          if (resumeAuthState) {
            document.location = redirectUri
          } else {
            this.submitWSForm(res._bodyInit)
          }
        } else if (errorCallback) {
          setTimeout(() => errorCallback(res))
        }
      })
      .catch((err) => {
        if (errorCallback) {
          setTimeout(() => errorCallback(err))
        }
        console.log(JSON.stringify(err))
      })
  }

  submitWSForm = (responseForm) => {
    const div = document.createElement('div')
    div.innerHTML = responseForm
    const formElement = document.body.appendChild(div).children[0]
    formElement.submit()
  }

  forgotPassword(email, errorCallback) {
    const options = {
      ...this.params,
      connection: authOpts.connection,
      responseType: authOpts.responseType,
      email
    }
    if (isIE8()) {
      this.forgotPasswordIE8(options, errorCallback)
    } else {
      this.instance.changePassword(options, (err) => {
        if (err) {
          if (errorCallback) {
            setTimeout(() => errorCallback(err), 5)
          }
          return false
        }
        document.location.hash = '#/forgotsuccess'
        return true
      })
    }
  }

  forgotPasswordIE8 = (data, errorCallback) => {
    ie8Fetch('/dbconnections/change_password', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...data
      })
    })
      .then((res) => {
        if (res.status === 200) {
          document.location.hash = '#/forgotsuccess'
        } else if (errorCallback) {
          setTimeout(() => errorCallback(res))
        }
      })
      .catch((err) => {
        if (errorCallback) {
          setTimeout(() => errorCallback(err))
        }
        console.log(JSON.stringify(err))
      })
  }

  resetPassword = (password, errorCallback) => {
    const callback = (res) => {
      if (res.status === 200) {
        document.location.hash = '#/resetsuccess'
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
    console.log(window.rpConfig.toString())
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
      if (isIE8()) {
        ie8Fetch('/lo/reset', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
          .then(callback)
          .catch(catchCallback)
      } else {
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
  }

  register(email, password, name, surname, allowContactMe, errorCallback) {
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
    if (isIE8()) {
      this.registerIE8(options, errorCallback)
    }
    this.instance.signup(options, (err) => {
      if (err) {
        if (errorCallback) {
          setTimeout(() => errorCallback(err))
        }
        return false
      }
      document.location.hash = '#/regsuccess'
      return true
    })
  }

  registerIE8 = (data, errorCallback) => {
    const redirectUri = window.config.extraParams.redirectURI
    ie8Fetch('/dbconnections/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...data,
        client_id: authOpts.clientID,
        redirect_uri: redirectUri
      })
    })
      .then((res) => {
        if (res.status === 200) {
          // document.location = redirectUri
        } else if (errorCallback) {
          setTimeout(() => errorCallback(res))
        }
      })
      .catch((err) => {
        if (errorCallback) {
          setTimeout(() => errorCallback(err))
        }
        console.log(err)
      })
  }

  resendVerificationEmail = (userId, callerCallback) => {
    console.log('resending email to: ', userId)
    const callback = (res) => {
      if (res.status === 200) {
        setTimeout(() => callerCallback(null)) // this will reset the error
      } else {
        setTimeout(() =>
          callerCallback('something has gone wrong when sending the email'))
      }
    }
    const catchCallback = (err) => {
      setTimeout(() =>
        callerCallback('something has gone wrong when sending the email'))
      console.log(JSON.stringify(err))
    }

    const data = {
      // ...this.params,
      user_id: userId,
      client_id: authOpts.clientID
    }
    if (isIE8()) {
      ie8Fetch(urls.resendVerificationEmail, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(callback)
        .catch(catchCallback)
    } else {
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
}
