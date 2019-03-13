/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
// eslint-disable-next-line

// eslint-disable-next-line
export const auth = {
  domain: __DEV__ ? 'alpha-nice-identity.eu.auth0.com' : '#{AUTH0_DOMAIN}',
  clientID: __DEV__
    ? 'ETzPLUtLTkCs8tHDjBfxNJKnnUzQGlmf'
    : '#{AUTH0_APP_CLIENT_ID}',
  scope: 'openid profile email',
  responseType: 'code',
  connection: __DEV__
    ? 'Identity'
    : '#{AUTH0_CONNECTION}',
  auth0CDN: 'https://cdn.eu.auth0.com'
}
