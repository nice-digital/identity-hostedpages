export const ensureTrailingSlash = (input) => {
  let slash
  if (input && typeof input === 'string') {
    slash = input.lastIndexOf('/') === input.length - 1 ? '' : '/'
    return input + slash
  }
  return input
}

export default ensureTrailingSlash
