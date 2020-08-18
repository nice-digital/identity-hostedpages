import { validateLoginFields } from '../index'

describe('validateLoginFields ', () => {

  //username/email
  it('should return tests.email => true with null email', () => {
    const emailValidation = validateLoginFields({ username: null }).username()
    expect(emailValidation).toBe(true)
  })

  it('should return tests.email => true with empty string email', () => {
    const emailValidation = validateLoginFields({ username: "" }).username()
    expect(emailValidation).toBe(true)
  })

  it('should return tests.email => false with non-null email', () => {
    const emailValidation = validateLoginFields({ username: "Bill@Murray.com" }).username()
    expect(emailValidation).toBe(false)
  })

  // password
  it('should return tests.password => true with null password', () => {
    const emailValidation = validateLoginFields({ password: null }).password()
    expect(emailValidation).toBe(true)
  })

  it('should return tests.password => true with empty string password', () => {
    const emailValidation = validateLoginFields({ password: "" }).password()
    expect(emailValidation).toBe(true)
  })

  it('should return tests.password => false with non-null password', () => {
    const emailValidation = validateLoginFields({ password: "PhilConnors" }).password()
    expect(emailValidation).toBe(false)
  })
}) 
  