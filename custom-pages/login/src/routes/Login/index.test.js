import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-14'
import { auth as authOpts } from '../../services/constants'
import Login from './'

Enzyme.configure({ adapter: new Adapter() })

describe('Login components', () => {
  let el
  let instance
  const auth = {
    login: jest.fn()
  }
  window.Auth0 = {
    strategies: {
      waad: {
        domainString: 'gotham.com'
      },
      'google-oauth2': {
        connectionName: 'google'
      }
    }
  }
  jest.mock('../../services/AuthApi')

  beforeEach(() => {
    el = shallow(<Login.component />)
    instance = el.instance()
    instance.auth = auth
  })

  it('should render <Login /> correctly', () => {
    expect(el).toMatchSnapshot()
  })

  it('should instantiate AuthApi', () => {
    expect(instance.auth).toBe(auth)
  })

  it('should render correctly when there is an error', () => {
    el.setState({ error: 'this is an error' }).update()
    expect(el).toMatchSnapshot()
  })

  it('should render correctly when there is username and password', () => {
    el.setState({
      valid: true
    }).update()
    expect(el).toMatchSnapshot()
  })

  it('should call the AuthApi login when login is invoked', () => {
    const username = 'username'
    const password = 'pwd'
    const { connection } = authOpts

    el.setState({
      username,
      password
    }).update()

    instance.login()
    expect(instance.auth.login).toBeCalledWith(
      connection,
      username,
      password,
      expect.any(Function),
      null,
    )
  })
})
