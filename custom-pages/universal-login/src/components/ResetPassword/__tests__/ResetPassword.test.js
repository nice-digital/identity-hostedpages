import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import ResetPassword from '../ResetPassword'

Enzyme.configure({ adapter: new Adapter() })

describe('ResetPassword components', () => {
    let el
    let instance
    const auth = {
        resetPassword: jest.fn()
    }
    const functionSignature = 'a function signature'
    jest.mock('../../../services/AuthApi')

    beforeEach(() => {
        el = shallow( < ResetPassword / > )
        instance = el.instance()
        instance.auth = auth
        instance.requestErrorCallback = functionSignature
    })

    it('should render ResetPassword correctly', () => {
        expect(el).toMatchSnapshot()
    })

    it('should instantiate AuthApi', () => {
        expect(instance.auth).toBe(auth)
    })

    it('should render correctly when there is an error', () => {
        el.setState({ error: 'this is an error' }).update()
        expect(el).toMatchSnapshot()
    })

    it('should render correctly when there is email', () => {
        el.setState({
            valid: true
        }).update()
        expect(el).toMatchSnapshot()
    })

    it('should call the AuthApi forgotPAssword when login is invoked', () => {
        const password = 'P@ssw0rd1234!&A'
        const history = undefined;
        el.setState({
            password,
            confirmPassword: password,
            errors: { password: false, confirmPassword: false },
            history
        }).update()

        instance.resetPassword()
        expect(instance.auth.resetPassword).toBeCalledWith(password, null, history)
    })
})