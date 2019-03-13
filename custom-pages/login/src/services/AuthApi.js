/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import Auth0 from 'auth0-js'
import pathOr from 'ramda/src/pathOr'
import fetch from 'fetch-ie8'
import { auth as authOpts } from './constants'
import isIE8 from '../util/isIE8'

const __DEV__ = global.__DEV__ || false
export default class AuthApi {
  static instance = null
  constructor() {
    if (!window.config) {
      window.config = {}
    }
    window.config.extraParams = window.config.extraParams || {}
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
        const source = `${
          __DEV__ ? authOpts.auth0CDN : window.config.clientConfigurationBaseUrl
        }/client/${authOpts.clientID}.js?t${+new Date()}`
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

  login(connection, email, password, errorCallback) {
    const redirectUri = pathOr(
      null,
      ['internalSettings', 'callback'],
      window.Auth0
    )
    let options
    let method
    if (connection === authOpts.connection) {
      options = {
        ...this.params,
        realm: connection,
        email,
        password
      }
      method = 'login'
    } else {
      options = {
        ...this.params,
        connection,
        email,
        sso: true,
        login_hint: email,
        response_mode: 'form_post'
      }
      method = 'authorize'
    }
    if (redirectUri) {
      options.redirect_uri = redirectUri
    }
    console.log('about to fire login')
    if (isIE8()) {
      this.loginIE8(options, errorCallback)
    } else {
      this.instance[method](options, (err) => {
        console.log('login callback')
        if (err) {
          if (errorCallback) {
            setTimeout(() =>
              errorCallback(method === 'login'
                ? 'Invalid email or password'
                : 'Something has gone wrong'))
          }
          throw new Error(err)
        }
      })
    }
  }

  loginIE8 = (data, errorCallback) => {
    const redirectUri = pathOr(
      null,
      ['internalSettings', 'callback'],
      window.Auth0
    )
    fetch('/usernamepassword/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((res) => {
        if (res.status === 200) {
          document.location = redirectUri
        } else if (errorCallback) {
          setTimeout(() => errorCallback('There has been an issue'))
        }
      })
      .catch((err) => {
        if (errorCallback) {
          setTimeout(() => errorCallback('There has been an issue'))
        }
        throw err
      })
  }

  forgotPassword(email, errorCallback) {
    this.instance.changePassword(
      {
        connection: authOpts.connection,
        responseType: authOpts.responseType,
        email
      },
      (err) => {
        if (err) {
          if (errorCallback) {
            setTimeout(
              () =>
                errorCallback('There has been an issue, try a different email'),
              5
            )
          }
          return false
        }
        document.location.hash = '#/forgotsuccess'
        return true
      }
    )
  }

  resetPassword = (password, errorCallback) => {
    console.debug(window.rpConfig)
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
        .then((res) => {
          if (res.status === 200) {
            document.location.hash = '#/resetsuccess'
          } else if (errorCallback) {
            setTimeout(() => errorCallback('There has been an issue'))
          }
        })
        .catch((err) => {
          if (errorCallback) {
            setTimeout(() => errorCallback('There has been an issue'))
          }
          throw err
        })
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
      return this.registerIE8(options, errorCallback)
    }
    return this.instance.signup(options, (err) => {
      if (err) {
        if (errorCallback) {
          setTimeout(() => errorCallback())
        }
        return false
      }
      document.location.hash = '#/regsuccess'
      return true
    })
  }

  registerIE8 = (data, errorCallback) => {
    console.log('registerIE8')
    const redirectUri = pathOr(
      null,
      ['internalSettings', 'callback'],
      window.Auth0
    )
    fetch('/dbconnections/signup', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((res) => {
        if (res.status === 200) {
          document.location = redirectUri
        } else if (errorCallback) {
          setTimeout(() => errorCallback('There has been an issue'))
        }
      })
      .catch((err) => {
        if (errorCallback) {
          setTimeout(() => errorCallback('There has been an issue'))
        }
        throw err
      })
  }
}
