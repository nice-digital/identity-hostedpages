export const getFirstErrorElement = (errors) => {
  const getElementWhenValueIsTrue = el => errors[el]
  const elementName = Object.keys(errors).filter(getElementWhenValueIsTrue)[0]
  return document.getElementsByName(elementName || 'email')[0]
}

export default getFirstErrorElement
