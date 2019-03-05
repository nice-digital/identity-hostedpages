import { showNav, hideNav } from './'

global.document.querySelector = jest.fn(() => ({
  setAttribute: jest.fn(),
  removeAttribute: jest.fn()
}))

describe('toggleNavigation ', () => {
  it('should invoke setTimeout for showNav', () => {
    jest.useFakeTimers()
    showNav()
    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function))
    jest.advanceTimersByTime(1) // 1ms
    expect(global.document.querySelector).toBeCalledWith('.navigation')
    expect(global.document.querySelector).toBeCalledWith('.forgotPasswordLink')
  })

  it('should invoke setTimeout for hideNav', () => {
    jest.useFakeTimers()
    hideNav()
    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function))
    jest.advanceTimersByTime(1) // 1ms
    expect(global.document.querySelector).toBeCalledWith('.navigation')
    expect(global.document.querySelector).toBeCalledWith('.forgotPasswordLink')
  })
})
