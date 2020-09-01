import { isDomainInUsername} from '../helpers';

// Validation returns true on failed validation
// and is passed through to state.errors.
export const validateLoginFields = ({
  username,
  password
}) => ({
  username: () => {
    return !username;
  },
  password: () => {
    var requirePasswordToLogin = !isDomainInUsername(username); 
    return  (requirePasswordToLogin && !password);
  }
});

export default validateLoginFields
