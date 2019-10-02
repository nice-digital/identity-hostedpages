import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import NotFound from '../NotFound'

Enzyme.configure({ adapter: new Adapter() })

describe('NotFound components', () => {
  it('should render NotFound correctly', () => {
    expect(shallow(<NotFound />)).toMatchSnapshot()
  })
})
