import auth0 from 'auth0-js'
import CordovaAuth0Plugin from 'auth0-js/dist/cordova-auth0-plugin.min'
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
      plugins: [new CordovaAuth0Plugin()],
      leeway: 1,
      popup: false,
      responseType: authOpts.responseType,
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
    this.instance = new auth0.WebAuth(params)
  }

  login(username, password, errorCallback) {
    this.instance.login(
      {
        realm: authOpts.connection,
        responseType: authOpts.responseType,
        username,
        password
      },
      (err) => {
        if (err) {
          if (errorCallback) {
            setTimeout(() => errorCallback('Invalid email or password'), 5)
          }
          throw new Error(err)
        }
        console.log('I am in, it should redirect')
        return true
      }
    )
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
