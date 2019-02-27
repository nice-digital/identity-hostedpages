import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-14'

import AppContainer from './AppContainer'

Enzyme.configure({ adapter: new Adapter() })

const props = { history: {}, routes: {}, routerKey: 1 }

describe('AppContainer components', () => {
  it('should render <AppContainer /> correctly', () => {
    expect(shallow(<AppContainer {...props} />)).toMatchSnapshot()
  })
})
