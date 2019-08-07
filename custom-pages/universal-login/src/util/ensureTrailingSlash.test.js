import { ensureTrailingSlash } from './'

describe('ensureTrailingSlash ', () => {
  it('return the input with a trailing slash when the latter is not in input', () => {
    expect(ensureTrailingSlash('batman')).toBe('batman/')
  })

  it('return the input with a trailing slash when the latter is already in input', () => {
    expect(ensureTrailingSlash('batman/')).toBe('batman/')
  })

  it('return the input if not string', () => {
    expect(ensureTrailingSlash(5000)).toBe(5000)
  })

  it('return the input if not string 2', () => {
    expect(ensureTrailingSlash(false)).toBe(false)
  })

  it('return the input if not string 3', () => {
    // using toEqual for Object equality
    expect(ensureTrailingSlash({ dummy: 'bar' })).toEqual({ dummy: 'bar' })
  })
})
