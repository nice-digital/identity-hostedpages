// Validation returns true on failed validation
// and is passed through to state.errors.
// See commit history
export const validateFields = ({
  email,
  confirmEmail,
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
  confirmEmail: () => (confirmEmail && email && email !== confirmEmail),
  password: () => {
    // At least 8 characters in length↵* Contain at least 3 of the following 4 types of characters:↵ * lower case letters (a-z)↵ * upper case letters (A-Z)↵ * numbers (i.e. 0-9)↵ * special characters (e.g. !@#$%^&*)
    const passwordRegex = /(?=.{8,})((?=.*\d)(?=.*[a-z])(?=.*[A-Z])|(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W!@#$%^&*])|(?=.*[a-z])(?=.*[A-Z])(?=.*[\W!@#$%^&*])).*/
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

export default validateFields
