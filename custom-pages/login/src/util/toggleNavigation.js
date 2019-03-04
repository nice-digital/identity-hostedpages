export const hideNav = () =>
  setTimeout(() => {
    document.querySelector('.navigation').setAttribute('style', 'display:none;')
  })

export const showNav = () =>
  setTimeout(() => {
    document.querySelector('.navigation').removeAttribute('style')
  })
