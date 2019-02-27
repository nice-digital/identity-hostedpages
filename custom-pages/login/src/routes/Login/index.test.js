import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-14'

import Login from './'

Enzyme.configure({ adapter: new Adapter() })

describe('Login components', () => {
  jest.mock('../../services/AuthApi', () => jest.fn(() => {}))

  it('should render <Login /> correctly', () => {
    expect(shallow(<Login.component />)).toMatchSnapshot()
  })
})
