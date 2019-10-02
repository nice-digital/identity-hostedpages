import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import App from '../App'

Enzyme.configure({ adapter: new Adapter() });

describe('App components', () => {

  beforeEach(() => {
    jest.resetModules()
  });

  it('should render Login components correctly', () => {
    process.env.REACT_APP_RENDER = 'login';
    expect(shallow(<App />)).toMatchSnapshot()
  });

  it('should render ResetPassword components correctly', () => {
    process.env.REACT_APP_RENDER = 'resetpassword';
    expect(shallow(<App />)).toMatchSnapshot()
  })
});
