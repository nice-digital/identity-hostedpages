import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import PasswordResetApp from '../PasswordResetApp'

Enzyme.configure({ adapter: new Adapter() });

const props = { history: {}, routes: {}, routerKey: 1 };

describe('LoginApp components', () => {
  it('should render <PasswordResetApp /> correctly', () => {
    expect(shallow(<PasswordResetApp {...props} />)).toMatchSnapshot()
  })
});
