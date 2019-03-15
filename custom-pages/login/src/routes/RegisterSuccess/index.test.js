import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-14'
import RegisterSuccess from './'

Enzyme.configure({ adapter: new Adapter() })

describe('RegisterSuccess components', () => {
  it('should render <RegisterSuccess /> correctly', () => {
    expect(shallow(<RegisterSuccess.component />)).toMatchSnapshot()
  })
})
