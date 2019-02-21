// eslint-disable-next-line
// export const auth = Object.freeze({
//   domain: 'alpha-nice-identity.eu.auth0.com',
//   clientID: 'ETzPLUtLTkCs8tHDjBfxNJKnnUzQGlmf',
//   scope: 'openid profile email',
//   responseType: 'code',
//   connection: 'Username-Password-Authentication'
// })

// eslint-disable-next-line
export const auth = Object.freeze({
  domain: '#{AUTH0_DOMAIN}',
  clientID: '#{AUTH0_CLIENT_ID}',
  scope: 'openid profile email',
  responseType: 'code',
  connection: '#{AUTH0_CONNECTION}'
})
