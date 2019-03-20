export const hideNav = () =>
  setTimeout(() => {
    document.querySelector('.navigation').setAttribute('style', 'display:none;')
    document
      .querySelector('.forgotPasswordLink')
      .setAttribute('style', 'display:none;')
  })

export const showNav = hideForgotPassword =>
  setTimeout(() => {
    document.querySelector('.navigation').removeAttribute('style')
    if (hideForgotPassword) {
      document
        .querySelector('.forgotPasswordLink')
        .setAttribute('style', 'display:none;')
    } else {
      document.querySelector('.forgotPasswordLink').removeAttribute('style')
    }
  })
