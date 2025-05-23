import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { MemoryRouter } from "react-router-dom";
import { auth as authOpts } from '../../../services/constants'
import Login from '../Login'


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
  jest.mock('../../../services/AuthApi')

  beforeEach(() => {
    el = shallow(<Login />)
    instance = el.instance()
    instance.auth = auth
  })

  it('should render Login correctly', () => {
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
      null
    )
  })

  it('clientSideHasErrors validates the username properly', () => {
    expect(!!instance.clientSideHasErrors({ username: null, password: null })).toBe(false);
    expect(!!instance.clientSideHasErrors({ username: false, password: false })).toBe(false);
    expect(!!instance.clientSideHasErrors({ username: true, password: true })).toBe(true);
    expect(!!instance.clientSideHasErrors({ username: true, password: false })).toBe(true);
    expect(!!instance.clientSideHasErrors({ username: false, password: true })).toBe(true);
  })

  it('should show client side errors when the username or password have not been supplied', () => {
    const stateBefore = el.state();
    expect(instance.clientSideHasErrors(stateBefore.clientSideErrors)).toBe(false);
    expect(stateBefore.username).toBeNull();
    expect(stateBefore.password).toBeNull();
    expect(stateBefore.clientSideErrors.username).toBe(false);
    expect(stateBefore.clientSideErrors.password).toBe(false);    

    const loginButton = el.find("button[data-qa-sel='login-button']");
    loginButton.simulate("click");
    
    const stateAfter = el.state();
    expect(instance.clientSideHasErrors(stateAfter.clientSideErrors)).toBe(true);
    expect(stateBefore.username).toBeNull();
    expect(stateBefore.password).toBeNull();
    expect(stateAfter.clientSideErrors.username).toBe(true);
    expect(stateAfter.clientSideErrors.password).toBe(true);    
  })

})
