/**
* Handler that will be called during the execution of a PostLogin flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
exports.onExecutePostLogin = async (event, api) => {
  if (!event.user.email_verified && event.request.query.protocol !== 'oauth2-password' && event.request.query.protocol !== 'oauth2-refresh-token' && event.request.query.protocol !== 'oauth2-resource-owner') {
    
    console.log('NOT VERIFIED EVENT:', event);
    api.redirect.sendUserTo(`https://${event.request.hostname}/login?client=${event.request.query.client_id}&protocol=oauth2&redirect_uri=${event.request.query.redirect_uri}&response_type=${event.request.query.response_type}&scope=${encodeURIComponent(event.request.query.scope)}&response_mode=${event.request.query.response_mode}&nonce=${event.request.query.nonce}&x-client-SKU=${event.request.query["x-client-SKU"]}&x-client-ver=${event.request.query["x-client-ver"]}&myerrorcode=user_not_verified&myerror=${encodeURIComponent('UnauthorizedError: Please verify your email before logging in.')}&userid=${encodeURIComponent(event.user.user_id)}&email=${event.user.email}`)
        
    return;

  } else {
    console.log('REGULAR PASS THROUGH WITH EVENT: ', event);
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
