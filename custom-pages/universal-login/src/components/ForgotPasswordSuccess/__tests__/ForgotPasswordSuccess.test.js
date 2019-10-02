import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import ForgotPasswordSuccess from '../ForgotPasswordSuccess'

Enzyme.configure({ adapter: new Adapter() });

describe('ForgotPasswordSuccess components', () => {
  it('should render ForgotPasswordSuccess correctly', () => {
    expect(shallow(<ForgotPasswordSuccess />)).toMatchSnapshot()
  })
});
