import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-14'
import Register from './'

Enzyme.configure({ adapter: new Adapter() })

describe('Register components', () => {
  let el
  let instance
  let props
  const auth = {
    register: jest.fn()
  }
  const functionSignature = 'a function signature'
  jest.mock('../../services/AuthApi')

  beforeEach(() => {
    el = shallow(<Register.component />)
    instance = el.instance()
    instance.auth = auth
    instance.requestErrorCallback = functionSignature
    props = {
      email: 'email@email.com',
      confirmEmail: 'email@email.com',
      password: 'Password01!',
      confirmPassword: 'Password01!',
      name: 'Bruce',
      surname: 'Wayne',
      tAndC: 'false',
      allowContactMe: 'false'
    }
  })

  it('should render <Register /> correctly', () => {
    expect(el).toMatchSnapshot()
  })

  it('should instantiate AuthApi', () => {
    expect(instance.auth).toBe(auth)
  })

  it('should render correctly when there is an error', () => {
    el.setState({ error: { email: true } }).update()
    expect(el).toMatchSnapshot()
  })

  it('should render correctly when form is valid', () => {
    el.setState({
      ...props
    }).update()
    expect(el).toMatchSnapshot()
  })

  it('should call the AuthApi register when register is invoked', () => {
    el.setState({
      ...props
    }).update()

    instance.register()
    expect(instance.auth.register).toBeCalledWith(props.email, props.password, props.name, props.surname, props.allowContactMe, expect.any(Function))
  })
})
