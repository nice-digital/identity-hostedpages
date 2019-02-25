import auth0 from 'auth0-js'
import CordovaAuth0Plugin from 'auth0-js/dist/cordova-auth0-plugin.min'
import { auth as authOpts } from './constants'

export default class AuthApi {
  static instance = null
  constructor() {
    // eslint-disable-next-line
    config.extraParams = (config && config.extraParams) || {}
    this.opts = {
      domain: authOpts.domain,
      clientID: authOpts.clientID,
      plugins: [new CordovaAuth0Plugin()],
      leeway: 1,
      popup: false,
      responseType: authOpts.responseType,
      scope: authOpts.scope,
      redirect: true,
      overrides: {
        // eslint-disable-next-line
        __tenant: config.auth0Tenant,
        // eslint-disable-next-line
        __token_issuer: config.authorizationServer.issuer
      }
    }
    // eslint-disable-next-line
    const params = Object.assign(this.opts, config.internalOptions)
    this.instance = new auth0.WebAuth(params)
  }

  login(username, password) {
    this.instance.login(
      {
        realm: authOpts.connection,
        username,
        password
      },
      (err) => {
        if (err) {
          console.error('could not login due to: ', err.message)
          return false
        }
        console.log('I am in, it should redirect')
        return true
      }
    )
  }

  register(email, password, name, surname, allowContactMe) {
    this.instance.signup(
      {
        connection: authOpts.connection,
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
          console.error(`Something went wrong: ${err.message}`)
          return false
        }
        console.log('success signup without login!')
        return true
      }
    )
  }

  logout() {
    this.instance.logout({
      clientID: authOpts.clientID,
      returnTo: authOpts.domain
    })
  }
}
