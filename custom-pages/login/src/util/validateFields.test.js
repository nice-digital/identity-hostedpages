import { validateFields } from './'

describe('validateFields ', () => {
  it('should return tests.email => true with invalid email', () => {
    const emailValidation = validateFields({ email: 'invalidEmail' }).email()
    expect(emailValidation).toBe(true)
  })
  it('should return tests.email => falsey with valid email', () => {
    const emailValidation = validateFields({
      email: 'validEmail@provider.com'
    }).email()
    expect(emailValidation).toBe(false)
  })
  it('should return tests.email => falsey with no email', () => {
    const emailValidation = validateFields({}).email()
    expect(emailValidation).toBe(undefined)
  })

  // it('should return tests.confirmEmail => falsey with no email', () => {
  //   const confirmEmailValidation = validateFields({
  //     confirmEmail: 'invalidEmail'
  //   }).confirmEmail()
  //   expect(confirmEmailValidation).toBe(undefined)
  // })
  it('should return tests.confirmEmail => true for invalid confirmEmail', () => {
    const confirmEmailValidation = validateFields({
      email: 'validEmail@provider.com',
      confirmEmail: 'validEmail@differentprovider.com'
    }).confirmEmail()
    expect(confirmEmailValidation).toBe(true)
  })
  it('should return tests.confirmEmail => falsey with no email and no confirmEmail', () => {
    const confirmEmailValidation = validateFields({}).confirmEmail()
    expect(confirmEmailValidation).toBe(undefined)
  })
  // it('should return tests.confirmEmail => true with no confirmEmail', () => {
  //   const confirmEmailValidation = validateFields({
  //     email: 'someEmail@provider.com'
  //   }).confirmEmail()
  //   expect(confirmEmailValidation).toBe(true)
  // })

  // password
  it('should return tests.password => true with invalid password (only numbers)', () => {
    const passwordValidation = validateFields({ password: '65340598673045986711' }).password()
    expect(passwordValidation).toBe(true)
  })
  it('should return tests.password => true with invalid password (only chars)', () => {
    const passwordValidation = validateFields({ password: 'sdklfhgabslkhdjfgalshjdkfb' }).password()
    expect(passwordValidation).toBe(true)
  })
  it('should return tests.password => true with invalid password (no uppercase and no special chars)', () => {
    const passwordValidation = validateFields({ password: 'testwaefasdfgsaed1234325452' }).password()
    expect(passwordValidation).toBe(true)
  })
  it('should return tests.password => true with invalid password (too short)', () => {
    const passwordValidation = validateFields({ password: 'Test12.' }).password()
    expect(passwordValidation).toBe(true)
  })
  it('should return tests.password => falsey with valid password', () => {
    const passwordValidation = validateFields({
      password: 'Password01!'
    }).password()
    expect(passwordValidation).toBe(false)
  })
  it('should return tests.password => falsey with no password', () => {
    const passwordValidation = validateFields({}).password()
    expect(passwordValidation).toBe(undefined)
  })

  it('should return tests.confirmPassword => falsey with no password', () => {
    const confirmPasswordValidation = validateFields({
      confirmPassword: 'anypassword'
    }).confirmPassword()
    expect(confirmPasswordValidation).toBe(undefined)
  })
  it('should return tests.confirmPassword => true for invalid confirmPassword', () => {
    const confirmPasswordValidation = validateFields({
      password: 'PAssword01!',
      confirmPassword: 'Password01!'
    }).confirmPassword()
    expect(confirmPasswordValidation).toBe(true)
  })
  it('should return tests.confirmPassword => falsey with no password and no confirmPassword', () => {
    const confirmPasswordValidation = validateFields({}).confirmPassword()
    expect(confirmPasswordValidation).toBe(undefined)
  })
  // it('should return tests.confirmPassword => true with no confirmPassword', () => {
  //   const confirmPasswordValidation = validateFields({
  //     password: 'Password01!'
  //   }).confirmPassword()
  //   expect(confirmPasswordValidation).toBe(true)
  // })

  // name and surname
  it('should return tests.name => true with invalid name', () => {
    const nameValidation = validateFields({ name: 'thisisaverylongnamethisisaverylongnamethisisaverylongnamethisisaverylongnamethisisaverylongnamethisisaverylongnamethisisaverylongnamethisisaverylongnamethisisaverylongname' }).name()
    expect(nameValidation).toBe(true)
  })
  it('should return tests.name => true with valid name', () => {
    const nameValidation = validateFields({ name: 'clark' }).name()
    expect(nameValidation).toBe(false)
  })

  it('should return tests.surname => true with invalid surname', () => {
    const surnameValidation = validateFields({ surname: 'thisisaverylongsurnamethisisaverylongsurnamethisisaverylongsurnamethisisaverylongsurnamethisisaverylongsurnamethisisaverylongsurnamethisisaverylongsurnamethisisaverylongsurnamethisisaverylongsurname' }).surname()
    expect(surnameValidation).toBe(true)
  })
  it('should return tests.surname => true with valid surname', () => {
    const surnameValidation = validateFields({ surname: 'kent' }).surname()
    expect(surnameValidation).toBe(false)
  })
})
