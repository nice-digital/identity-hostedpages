import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-14'

import Layout from './'

Enzyme.configure({ adapter: new Adapter() })
const props = { children: <div /> }

describe('Layout components', () => {
  it('should render <Layout /> correctly', () => {
    expect(shallow(<Layout {...props} />)).toMatchSnapshot()
  })
})
