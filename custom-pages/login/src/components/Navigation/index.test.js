
import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-14'

import Nav from './'

Enzyme.configure({ adapter: new Adapter() })

describe('Nav components', () => {
  it('should render <Nav /> correctly', () => {
    expect(shallow(<Nav />)).toMatchSnapshot()
  })
})
