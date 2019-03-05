export const getFirstErrorElement = (errors) => {
  if (errors) {
    const getElementWhenValueIsTrue = el => errors[el]
    const elementNameArray = Object.keys(errors).filter(getElementWhenValueIsTrue)
    const elementName = elementNameArray && elementNameArray.length ? elementNameArray[0] : null
    const array = document.getElementsByName(elementName || 'email')
    return array && array.length ? array[0] : null
  }
  return null
}

export default getFirstErrorElement
