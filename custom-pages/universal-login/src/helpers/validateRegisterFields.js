// Validation returns true on failed validation
// and is passed through to state.errors.
// See commit history
export const validateRegisterFields = ({
  email,
  password,
  confirmPassword,
  name,
  surname,
  tAndC
}) => ({
  email: () => {
    const emailRegex = /\S+@\S+\.\S+/
    return email && !emailRegex.test(email.toLowerCase())
  },
  password: () => {
    // At least 14 characters in length and must include at least 1 x special character, 1 x number, 1 x capital
    const passwordRegex =  /^(?=.{14,})(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).*$/
    return password && !passwordRegex.test(password)
  },
  confirmPassword: () =>
    (password && confirmPassword && confirmPassword !== password),
  name: () => {
    return name && (name.length > 100 || /[<>]/g.test(name));
  },
  surname: () => {
    return surname && (surname.length > 100 || /[<>]/g.test(surname));
  },
  tAndC: () => password && email && name && surname && !tAndC
});

export default validateRegisterFields
