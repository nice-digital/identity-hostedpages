import { getFirstErrorElement } from './'

global.document.getElementsByName = jest.fn()

describe('getFirstErrorElement ', () => {
  it('should not invoke document.getElementsByName when called without args', () => {
    getFirstErrorElement()
    expect(global.document.getElementsByName).not.toHaveBeenCalled()
  })

  it('should default to email', () => {
    getFirstErrorElement({})
    expect(global.document.getElementsByName).toBeCalledWith('email')
  })

  it('should return the correct value', () => {
    getFirstErrorElement({ password: true })
    expect(global.document.getElementsByName).toBeCalledWith('password')
  })
})
