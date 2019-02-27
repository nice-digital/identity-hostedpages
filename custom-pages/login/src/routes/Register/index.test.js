import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-14'

import Register from './'

Enzyme.configure({ adapter: new Adapter() })

describe('Register components', () => {
  jest.mock('../../services/AuthApi', () => jest.fn(() => {}))

  it('should render <Register /> correctly', () => {
    expect(shallow(<Register.component />)).toMatchSnapshot()
  })
})
