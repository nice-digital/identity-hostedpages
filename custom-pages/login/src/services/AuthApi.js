import Auth0 from 'auth0-js'
// import CordovaAuth0Plugin from 'auth0-js/dist/cordova-auth0-plugin.min'
import pathOr from 'ramda/src/pathOr'
import { auth as authOpts } from './constants'

export default class AuthApi {
  static instance = null
  constructor() {
    if (!window.config) {
      window.config = {}
    }
    window.config.extraParams = window.config.extraParams || {}
    this.opts = {
      domain: authOpts.domain,
      clientID: authOpts.clientID,
      // plugins: [new CordovaAuth0Plugin()],
      leeway: 1,
      popup: false,
      responseType: authOpts.responseType || 'code',
      scope: authOpts.scope,
      redirect: true
      // overrides: {
      //   // eslint-disable-next-line
      //   __tenant: config.auth0Tenant,
      //   // eslint-disable-next-line
      //   __token_issuer: config.authorizationServer.issuer
      // }
    }
    const params = Object.assign(this.opts, window.config.internalOptions)
    this.instance = new Auth0(params)
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
        let source
        if (document.location.host.indexOf('localhost') !== -1) {
          source = `https://cdn.eu.auth0.com/client/ETzPLUtLTkCs8tHDjBfxNJKnnUzQGlmf.js?t${+new Date()}`
        } else {
          source = `${window.config.clientConfigurationBaseUrl}client/${
            authOpts.clientID
          }.js?t${+new Date()}`
        }
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
        realm: connection,
        responseType: authOpts.responseType,
        email,
        password
      }
      method = 'login'
    } else {
      options = {
        connection,
        responseType: authOpts.responseType,
        email,
        sso: true,
        login_hint: email,
        response_mode: 'form_post'
      }
      if (redirectUri) {
        options.redirect_uri = redirectUri
      }
      method = 'authorize'
    }
    this.instance[method](options, (err) => {
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
            setTimeout(() => errorCallback('There has been an issue'), 5)
          }
        })
        .catch((err) => {
          if (errorCallback) {
            setTimeout(() => errorCallback('There has been an issue'), 5)
          }
          throw err
        })
    }
  }

  register(email, password, name, surname, allowContactMe, errorCallback) {
    return this.instance.signup(
      {
        connection: authOpts.connection,
        responseType: authOpts.responseType,
        email,
        password,
        user_metadata: {
          name,
          surname,
          allowContactMe
        }
      },
      (err) => {
        if (err) {
          if (errorCallback) {
            errorCallback()
          }
          return false
        }
        document.location.hash = '#/regsuccess'
        return true
      }
    )
  }
}
