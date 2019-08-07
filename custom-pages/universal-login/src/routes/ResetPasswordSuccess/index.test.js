import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import ResetPasswordSuccess from './'

Enzyme.configure({ adapter: new Adapter() })

describe('ResetPasswordSuccess components', () => {
  it('should render <ResetPasswordSuccess /> correctly', () => {
    expect(shallow(<ResetPasswordSuccess.component />)).toMatchSnapshot()
  })
})
