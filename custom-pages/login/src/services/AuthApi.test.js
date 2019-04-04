import AuthApi from './AuthApi'

describe('AppContainer components', () => {
  it('should create an instance of AuthApi correctly', () => {
    expect(new AuthApi()).toMatchSnapshot()
  })

  it('should create an instance of AuthApi correctly with no config', () => {
    const api = new AuthApi()
    expect(api.instance).toMatchSnapshot()
  })

  it('should create an instance of AuthApi correctly with UnauthorizedError config', () => {
    global.config = {
      assetsUrl: '',
      auth0Domain: 'dev-nice-identity.eu.auth0.com',
      auth0Tenant: 'dev-nice-identity',
      clientConfigurationBaseUrl: 'https://cdn.eu.auth0.com/',
      callbackOnLocationHash: false,
      callbackURL: 'https://dev-identityadmin.nice.org.uk/signin-auth0',
      cdn: 'https://cdn.auth0.com/',
      clientID: 'RMpYVjKE_B85IO6Euc2i3IstVAstrEHK',
      dict: { signin: { title: 'Default App' } },
      extraParams: {
        protocol: 'oauth2',
        scope: 'openid read:profile',
        response_mode: 'form_post',
        nonce:
          '636892985897575998.YzdhZDAzZWEtMzMxMi00M2UyLWE3YTUtZWM4Y2Y1ZTg0MTA4OTMyMTFjN2UtZDQ3My00OTkyLWI5YTktMWQ3NDcwMzRkMWY4',
        'x-client-SKU': 'ID_NETSTANDARD1_4',
        'x-client-ver': '5.2.4.0',
        myerrorcode: 'user_not_verified',
        myerror:
          'UnauthorizedError: Please verify your email before logging in.',
        userid: 'auth0|5c9b9bd6e893312e96990ebe',
        tenant: 'dev-nice-identity',
        type: 'code',
        clientID: 'RMpYVjKE_B85IO6Euc2i3IstVAstrEHK',
        redirectURI: 'https://dev-identityadmin.nice.org.uk/signin-auth0',
        _csrf: 'cw0pc1an-H9XDTeTz_pO9vgCCPC152gm-srY',
        _intstate: 'deprecated',
        state:
          'g6Fo2SBVdzZld3h1Z25QeURkREh1LTBVcU9rY2taRGR4dlBEU6N0aWTZIGxzcUl0aUxRTHFNam5yVFRJdzhlNllzLUFWNXU4bTJso2NpZNkgUk1wWVZqS0VfQjg1SU82RXVjMmkzSXN0VkFzdHJFSEs'
      },
      internalOptions: {
        protocol: 'oauth2',
        scope: 'openid read:profile',
        response_mode: 'form_post',
        nonce:
          '636892985897575998.YzdhZDAzZWEtMzMxMi00M2UyLWE3YTUtZWM4Y2Y1ZTg0MTA4OTMyMTFjN2UtZDQ3My00OTkyLWI5YTktMWQ3NDcwMzRkMWY4',
        'x-client-SKU': 'ID_NETSTANDARD1_4',
        'x-client-ver': '5.2.4.0',
        myerrorcode: 'user_not_verified',
        myerror:
          'UnauthorizedError: Please verify your email before logging in.',
        userid: 'auth0|5c9b9bd6e893312e96990ebe',
        tenant: 'dev-nice-identity',
        type: 'code',
        clientID: 'RMpYVjKE_B85IO6Euc2i3IstVAstrEHK',
        redirectURI: 'https://dev-identityadmin.nice.org.uk/signin-auth0',
        _csrf: 'cw0pc1an-H9XDTeTz_pO9vgCCPC152gm-srY',
        _intstate: 'deprecated',
        state:
          'g6Fo2SBVdzZld3h1Z25QeURkREh1LTBVcU9rY2taRGR4dlBEU6N0aWTZIGxzcUl0aUxRTHFNam5yVFRJdzhlNllzLUFWNXU4bTJso2NpZNkgUk1wWVZqS0VfQjg1SU82RXVjMmkzSXN0VkFzdHJFSEs'
      },
      widgetUrl: 'https://cdn.auth0.com/w2/auth0-widget-5.1.min.js',
      isThirdPartyClient: false,
      authorizationServer: {
        url: 'https://dev-nice-identity.eu.auth0.com',
        issuer: 'https://dev-nice-identity.eu.auth0.com/'
      },
      colors: {}
    }
    const api = new AuthApi()
    expect(api.instance).toMatchSnapshot()
  })
})
