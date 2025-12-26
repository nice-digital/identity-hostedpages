import { validateRegisterFields } from "../validateRegisterFields";

describe("validateFields ", () => {
  it("should return tests.email => true with invalid email", () => {
    const emailValidation = validateRegisterFields({ email: "invalidEmail" }).email();
    expect(emailValidation).toBe(true);
  });

  it("should return tests.email => falsey with valid email", () => {
    const emailValidation = validateRegisterFields({
      email: "validEmail@provider.com"
    }).email();
    expect(emailValidation).toBe(false);
  });

  it("should return tests.email => falsey with no email", () => {
    const emailValidation = validateRegisterFields({}).email();
    expect(emailValidation).toBe(undefined);
  });


  // password
  it("should return tests.password => true with invalid password (only numbers)", () => {
    const passwordValidation = validateRegisterFields({ password: "65340598673045986711" }).password();
    expect(passwordValidation).toBe(true);
  });

  it("should return tests.password => true with invalid password (only chars)", () => {
    const passwordValidation = validateRegisterFields({ password: "sdklfhgabslkhdjfgalshjdkfb" }).password();
    expect(passwordValidation).toBe(true);
  });

  it("should return tests.password => true with invalid password (no uppercase and no special chars)", () => {
    const passwordValidation = validateRegisterFields({ password: "testwaefasdfgsaed1234325452" }).password();
    expect(passwordValidation).toBe(true);
  });

  it("should return tests.password => true with invalid password (too short)", () => {
    const passwordValidation = validateRegisterFields({ password: "Test12." }).password();
    expect(passwordValidation).toBe(true);
  })

  it("should return tests.password => falsey with valid password", () => {
    const passwordValidation = validateRegisterFields({
      password: "P@ssw0rd1234!&A"
    }).password();
    expect(passwordValidation).toBe(false);
  });

  it("should return tests.password => falsey with no password", () => {
    const passwordValidation = validateRegisterFields({}).password();
    expect(passwordValidation).toBe(undefined);
  })

  it("should return tests.confirmPassword => falsey with no password", () => {
    const confirmPasswordValidation = validateRegisterFields({
      confirmPassword: "anypassword"
    }).confirmPassword();
    expect(confirmPasswordValidation).toBe(undefined);
  });

  it("should return tests.confirmPassword => true for invalid confirmPassword", () => {
    const confirmPasswordValidation = validateRegisterFields({
      password: "P@ssw0rd1234!&A",
      confirmPassword: "P@ssw0rd1234!&"
    }).confirmPassword();
    expect(confirmPasswordValidation).toBe(true);
  });

  it("should return tests.confirmPassword => falsey with no password and no confirmPassword", () => {
    const confirmPasswordValidation = validateRegisterFields({}).confirmPassword();
    expect(confirmPasswordValidation).toBe(undefined);
  });

  // it("should return tests.confirmPassword => true with no confirmPassword", () => {
  //   const confirmPasswordValidation = validateRegisterFields({
  //     password: "Password01!"
  //   }).confirmPassword();
  //   expect(confirmPasswordValidation).toBe(true);
  // });

  // name and surname
  it("should return tests.name => true with invalid name", () => {
    const nameValidation = validateRegisterFields({ name: "thisisaverylongnamethisisaverylongnamethisisaverylongnamethisisaverylongnamethisisaverylongnamethisisaverylongnamethisisaverylongnamethisisaverylongnamethisisaverylongname" }).name();
    expect(nameValidation).toBe(true);
  });

  it("should return tests.name => true with valid name", () => {
    const nameValidation = validateRegisterFields({ name: "clark" }).name();
    expect(nameValidation).toBe(false);
  });

  it("should return tests.surname => true with invalid surname", () => {
    const surnameValidation = validateRegisterFields({ surname: "thisisaverylongsurnamethisisaverylongsurnamethisisaverylongsurnamethisisaverylongsurnamethisisaverylongsurnamethisisaverylongsurnamethisisaverylongsurnamethisisaverylongsurnamethisisaverylongsurname" }).surname();
    expect(surnameValidation).toBe(true);
  });

  it("should return tests.surname => true with valid surname", () => {
    const surnameValidation = validateRegisterFields({ surname: "kent" }).surname();
    expect(surnameValidation).toBe(false);
  });
});
