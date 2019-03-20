import AuthApi from './AuthApi'


describe('AppContainer components', () => {
  it('should create an instance of AuthApi correctly', () => {
    expect(new AuthApi()).toMatchSnapshot()
  })
})
