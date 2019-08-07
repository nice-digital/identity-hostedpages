import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import authOpts from './constants'

Enzyme.configure({ adapter: new Adapter() })

describe('Register components', () => {
  it('should retrieve the constants correctly', () => {
    expect(authOpts).toMatchSnapshot()
  })
})
