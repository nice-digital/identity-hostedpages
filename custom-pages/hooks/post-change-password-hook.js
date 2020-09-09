/**
@param {object} user - The affected user
@param {string} user.id - user id
@param {string} user.username - user name
@param {string} user.email - email
@param {string} user.last_password_reset - exact date/time the user's password was changed
@param {object} context - Auth0 connection and other context info
@param {object} context.connection - information about the Auth0 connection
@param {object} context.connection.id - connection id
@param {object} context.connection.name - connection name
@param {object} context.connection.tenant - connection tenant
@param {object} context.webtask - webtask context
@param {function} cb - function (error)
*/
/**
 * Following secrets need to be added to the hook using the configuration->secrets menu on the top left:
 * - tokenEndpoint - auth0 token endpoint
 * - identityApiClientId - identity api client id (see API application settings)
 * - identityApiClientSecret - identity api client secret (see API application settings)
 * - identityApiAudience - identity api audience (see API settings)
 * - identityApiUsersEndpoint - identity api users endpoint
 * - niceAccountsEndpoint - nice accounts endpoint
 * - niceAccountsRealm - realm for the nice accounts api user
 * - niceAccountsAPIKey - api key for the nice accounts api user
 */
module.exports = function (user, context, cb) {
  const request = require("request");

  console.log("post-change-password hook start");
  console.log("user:");
  console.log(JSON.stringify(user));
  console.log("context:");
  console.log(JSON.stringify(context));
  console.log("context end");

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
      console.log(`post-change-password token request error: ${error}`);
      throw new Error(error);
    }

    console.log("post-change-password hook - hitting api to see if email exists");
    const accessToken = body.access_token;
    
    const userExistsOptions = { method: 'GET',
      url: context.webtask.secrets.identityApiUsersEndpoint + `?q=${user.email}`,
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      }
    };

    request(userExistsOptions, function(error, response, body) {
      console.log(`post-change-password get users api response: ${JSON.stringify(response)}`);
      
      if (error) {
        console.log(`post-change-password get users identity api error: ${error}`);
        throw new Error(error);
      }

      const responseBody = response.body;
      const userExists = (Array.isArray(response.body) && response.body.length !== 0);
      if (userExists){
        console.log(`password reset for user that does exist: ${user.email}`);
        cb();
      }
      
      //user doesn't exist. this could happen if the user has reset a password for a user that is in nice accounts
      console.log("now to hit nice accounts to see if the user exists there");
      
      const niceAccountsOptions = { method: 'POST',
        url: context.webtask.secrets.niceAccountsEndpoint,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        form: {
          'username': user.email,
          'apikey': context.webtask.secrets.niceAccountsAPIKey,
          'wtrealm': context.webtask.secrets.niceAccountsRealm
        }
      };
      
      request(niceAccountsOptions, function(error, response, body) {

        if (error) {
          console.log(`post-change-password nice accounts error: ${error}`);
          throw new Error(error);
        }
      
        if (response.statusCode !== 200){
          console.log(`nice accounts call returned status code: ${response.statusCode}`);
          cb();
        }
      
        //at this point nice accounts has returned a valid user, which doesn't exist in the idam db, so we just need to hit our db with the user.
        let user = JSON.parse(body);
    	  const userIdNoPrefix = user.user_id.toString();
    	  user.user_id = "auth0|" + userIdNoPrefix;
        
        const postData = JSON.stringify({
					'nameIdentifier': user.user_id,
					'firstName': user.given_name,
					'lastName': user.family_name,
					'emailAddress': user.email,
					'acceptedTerms': false,
					'allowContactMe': false,
					'hasVerifiedEmailAddress': true,
					'isLockedOut': false,
					'isMigrated': true,
					'isStaffMember':false,
					'isInAuthenticationProvider': false //the user won't get created in auth0 db until they log in.
				});
        
         const createUserOptions = { method: 'POST',
            url: context.webtask.secrets.identityApiUsersEndpoint,
            headers: {
              'Authorization': 'Bearer ' + accessToken, //not sure about this use of accessToken
              'Content-Type': 'application/json'
            },
            body: postData
          };
          console.log(`create user options: ${JSON.stringify(createUserOptions)}`);
          
          request(createUserOptions, function(error, response, body) {

            if (error) {
              console.log(`post-change-password user creation request error: ${error}`);
              throw new Error(error);
            }
          
            console.log("post-change password user creation success");
            cb();
          });
      });
    })
  });
};