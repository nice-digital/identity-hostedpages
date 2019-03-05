export const hideNav = () =>
  setTimeout(() => {
    document.querySelector('.navigation').setAttribute('style', 'display:none;')
    document.querySelector('.forgotPasswordLink').setAttribute('style', 'display:none;')
  })

export const showNav = () =>
  setTimeout(() => {
    document.querySelector('.navigation').removeAttribute('style')
    document.querySelector('.forgotPasswordLink').removeAttribute('style')
  })
