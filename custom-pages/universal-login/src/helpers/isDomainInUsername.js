export const isDomainInUsername = (username) => {
  const domain = window.Auth0.strategies && window.Auth0.strategies.waad && window.Auth0.strategies.waad.domainString || null;
  if (username && domain && typeof domain === 'string') {
    return username.toLowerCase().indexOf(domain.toLowerCase()) !== -1
  }
  return false
}

export default isDomainInUsername
