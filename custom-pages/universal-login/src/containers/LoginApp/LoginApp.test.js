import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import LoginApp from './LoginApp'

Enzyme.configure({ adapter: new Adapter() });

const props = { history: {}, routes: {}, routerKey: 1 };

describe('LoginApp components', () => {
  it('should render <LoginApp /> correctly', () => {
    expect(shallow(<LoginApp {...props} />)).toMatchSnapshot()
  })
});
