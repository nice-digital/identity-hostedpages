import { isDomainInUsername } from './isDomainInUsername'

describe('isDomainInUsername ', () => {
  window.Auth0 = {
    strategies: {
      waad: {
        domainString: 'gotham.com'
      }
    }
  }
  it('should return true with domain in username', () => {
    expect(isDomainInUsername('batman@gotham.com')).toBe(true)
  })

  it('should return true with domain NOT in username', () => {
    expect(isDomainInUsername('superman@earth.com')).toBe(false)
  })
})
