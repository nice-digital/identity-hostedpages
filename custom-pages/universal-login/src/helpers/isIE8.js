export const isIE8 = () => {
  if (navigator.appName.indexOf('Internet Explorer') !== -1) {
    // yeah, he's using IE
    const badBrowser =
      navigator.appVersion.indexOf('MSIE 9') === -1 && // v9 is ok
      navigator.appVersion.indexOf('MSIE 1') === -1 // v10, 11, 12, etc. is fine too

    if (badBrowser) {
      return true
    }
    return false
  }
  return false
}

export default isIE8
