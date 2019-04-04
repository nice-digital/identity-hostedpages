/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
// eslint-disable-next-line
const __DEV__ = global.__DEV__ || false
// eslint-disable-next-line
export const auth = {
  domain: __DEV__ ? 'dev-nice-identity.eu.auth0.com' : '#{AUTH0_DOMAIN}',
  clientID: __DEV__
    ? 'RMpYVjKE_B85IO6Euc2i3IstVAstrEHK'
    : '#{AUTH0_APP_CLIENT_ID}',
  scope: 'openid profile email ',
  responseType: 'code',
  connection: __DEV__
    ? 'Identity'
    : '#{AUTH0_CONNECTION}',
  auth0CDN: 'https://cdn.eu.auth0.com'
}

export const urls = {
  resendVerificationEmail: '#{IDENTITY_API}/api/Jobs/VerificationEmail'
}
