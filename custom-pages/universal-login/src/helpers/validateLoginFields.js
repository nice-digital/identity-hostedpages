import { isDomainInUsername} from '../helpers';

// Validation returns true on failed validation
// and is passed through to state.errors.
export const validateLoginFields = ({
  username,
  password
}) => ({
  username: () => {
    //console.log("username accessor");
    //console.log(`returning: ${!username} for username`);
    return !username;
  },
  password: () => {
    //console.log("username is:" + username);
    //console.log(`password accessor ${isDomainInUsername(username)}`);
    var requirePasswordToLogin = !isDomainInUsername(username); 
    //console.log(`password required to login: ${requirePasswordToLogin}`);
    return  (requirePasswordToLogin && !password);
  }
});

export default validateLoginFields
