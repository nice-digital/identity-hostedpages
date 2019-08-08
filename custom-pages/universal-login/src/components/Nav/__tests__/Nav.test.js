import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Nav from '../Nav'

Enzyme.configure({ adapter: new Adapter() });

describe('Nav components', () => {
  it('should render Nav correctly', () => {
    expect(shallow(<Nav />)).toMatchSnapshot()
  })
});
