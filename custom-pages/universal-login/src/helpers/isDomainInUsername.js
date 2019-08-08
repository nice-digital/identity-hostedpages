import pathOr from 'ramda/src/pathOr'

export const isDomainInUsername = (username) => {
  const domain = pathOr(
    null,
    ['strategies', 'waad', 'domainString'],
    window.Auth0
  )
  if (username && domain && typeof domain === 'string') {
    return username.toLowerCase().indexOf(domain.toLowerCase()) !== -1
  }
  return false
}

export default isDomainInUsername
