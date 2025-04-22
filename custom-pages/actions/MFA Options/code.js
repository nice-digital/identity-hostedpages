/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * --- AUTH0 ACTIONS TEMPLATE https://github.com/auth0/opensource-marketplace/blob/main/templates/mfa-require-enrollment-POST_LOGIN ---
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */

  
exports.onExecutePostLogin = async (event, api) => {
  console.log("hello la" + JSON.stringify(event));
   if ((event.connection.strategy !== "waad" && 
       event.connection.strategy !== "google-oauth2")){
    const enrolledFactors = event.user.enrolledFactors.map((f) => ({type: f.type}));
    if (enrolledFactors.length < 2)
    {
      api.authentication.enrollWithAny([{type: 'otp'}]);
    } else {
      api.authentication.challengeWith({ type: 'otp' }, 
        { additionalFactors: enrolledFactors })
    }
    return;
  }  
};


/**
 * Handler that will be invoked when this action is resuming after an external redirect. If your
 * onExecutePostLogin function does not perform a redirect, this function can be safely ignored.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
// exports.onContinuePostLogin = async (event, api) => {
// };
