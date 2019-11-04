/**
 * @param {object} user - The user being created
 * @param {string} user.id - user id
 * @param {string} user.tenant - Auth0 tenant name
 * @param {string} user.username - user name
 * @param {string} user.email - email
 * @param {boolean} user.emailVerified - is e-mail verified
 * @param {string} user.phoneNumber - phone number
 * @param {boolean} user.phoneNumberVerified - is phone number verified?
 * @param {object} user.user_metadata - user metadata
 * @param {object} user.app_metadata - application metadata
 * @param {object} context - Auth0 connection and other context info
 * @param {string} context.requestLanguage - language of the client agent
 * @param {object} context.connection - information about the Auth0 connection
 * @param {object} context.connection.id - connection id
 * @param {object} context.connection.name - connection name
 * @param {object} context.connection.tenant - connection tenant
 * @param {object} context.webtask - webtask context
 * @param {string} context.webtask.secrets.tokenEndpoint - auth0 token endpoint
 * @param {string} context.webtask.secrets.identityApiClientId - identity api client id
 * @param {string} context.webtask.secrets.identityApiClientSecret - identity api client secret
 * @param {string} context.webtask.secrets.identityApiAudience - identity api audience
 * @param {string} context.webtask.secrets.identityApiUsersEndpoint - identity api users endpoint
 * @param {function} cb - function (error, response)
 */
/**
 * Following secrets need to be added to the hook using the configuration->secrets menu on the top left:
 * - tokenEndpoint - auth0 token endpoint
 * - identityApiClientId - identity api client id (see API application settings)
 * - identityApiClientSecret - identity api client secret (see API application settings)
 * - identityApiAudience - identity api audience (see API settings)
 * - identityApiUsersEndpoint - identity api users endpoint
 */
module.exports = function (user, context, cb) {
  const request = require("request");

  console.log("user-created hook start");

  var tokenOptions = { method: 'POST',
    url: context.webtask.secrets.tokenEndpoint,
    headers: { 'content-type': 'application/json' },
    body:
      { grant_type: 'client_credentials',
        client_id: context.webtask.secrets.identityApiClientId,
        client_secret: context.webtask.secrets.identityApiClientSecret,
        audience: context.webtask.secrets.identityApiAudience },
    json: true };

  request(tokenOptions, function(error, response, body) {

    if (error) {
      console.log(`user-created token request error: ${error}`);
      throw new Error(error);
    }

    console.log("user-created send data to NICE identity api");

    let firstName = user && user.user_metadata && user.user_metadata.name ? user.user_metadata.name : null;
    let lastName = user && user.user_metadata && user.user_metadata.surname ? user.user_metadata.surname : null;
    let acceptedTerms = user && user.user_metadata && user.user_metadata.acceptedTerms ? user.user_metadata.acceptedTerms : false;
    let allowContactMe = user && user.user_metadata && user.user_metadata.allowContactMe ? user.user_metadata.allowContactMe : false;
    let hasVerifiedEmailAddress = false;
    let isLockedOut = false;
    let isMigrated = false;
    let isStaffMember = user.email.endsWith('@nice.org.uk');

    const postData = JSON.stringify({
      'auth0UserId': 'auth0|' + user.id,
      'firstName': firstName,
      'lastName': lastName,
      'emailAddress': user.email,
      'acceptedTerms': acceptedTerms,
      'allowContactMe': allowContactMe,
      'hasVerifiedEmailAddress': hasVerifiedEmailAddress,
      'isLockedOut': isLockedOut,
      'isMigrated': isMigrated,
      "isStaffMember": isStaffMember
    });

    const options = { method: 'POST',
      url: context.webtask.secrets.identityApiUsersEndpoint,
      headers: {
        'Authorization': 'Bearer ' + body.access_token,
        'Content-Type': 'application/json'
      },
      body: postData
    };

    console.log("user-created send data to api endpoint ", options.url, 'for user ', user.id);

    request(options, function(error, response, body) {
      console.log(`user-created identity api response: ${JSON.stringify(response)}`);
      if (error) {
        console.log(`user-created identity api error: ${error}`);
        throw new Error(error);
      }
    })
  });

  console.log('user-created hook finished');
  cb();
};
