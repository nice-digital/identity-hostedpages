import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import RegisterSuccess from '../RegisterSuccess'

Enzyme.configure({ adapter: new Adapter() });

describe('RegisterSuccess components', () => {
  it('should render RegisterSuccess correctly', () => {
    expect(shallow(<RegisterSuccess />)).toMatchSnapshot()
  })
});
