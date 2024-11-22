/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
// eslint-disable-next-line
const __DEV__ = global.__DEV__ || false
// eslint-disable-next-line
export const auth = {
  domain: __DEV__ ? 'dev-nice-identity.eu.auth0.com' : 'dev-nice-identity.eu.auth0.com',
  clientID: __DEV__
    ? 'PdZjg3cjWZxNMLrkrRlKIgPJaGS5yYEr'
    : 'PdZjg3cjWZxNMLrkrRlKIgPJaGS5yYEr',
  scope: 'openid profile email ',
  responseType: 'code',
  connection: __DEV__
    ? 'Identity'
    : 'Identity',
  auth0CDN: 'https://cdn.eu.auth0.com'
}

export const urls = {
  resendVerificationEmail: '#{IDENTITY_API}/api/VerificationEmail/VerificationEmail'
}
