/**
@param {object} user - The user being created
@param {string} user.id - user id
@param {string} user.tenant - Auth0 tenant name
@param {string} user.username - user name
@param {string} user.email - email
@param {boolean} user.emailVerified - is e-mail verified?
@param {string} user.phoneNumber - phone number
@param {boolean} user.phoneNumberVerified - is phone number verified?
@param {object} user.user_metadata - user metadata
@param {object} user.app_metadata - application metadata
@param {object} context - Auth0 connection and other context info
@param {string} context.requestLanguage - language of the client agent
@param {object} context.connection - information about the Auth0 connection
@param {object} context.connection.id - connection id
@param {object} context.connection.name - connection name
@param {object} context.connection.tenant - connection tenant
@param {object} context.webtask - webtask context
@param {function} cb - function (error, response)
*/
module.exports = function (user, context, cb) {
  const request = require("request");

  console.log("hitting the hook which is hit when a user is created");

  var tokenOptions = { method: 'POST',
      url: 'https://' + context.webtask.secrets.appdomain + context.webtask.secrets.gettokenpath,
      headers: { 'content-type': 'application/json' },
      body: 
       { grant_type: 'client_credentials',
         client_id: context.webtask.secrets.client_id,
         client_secret: context.webtask.secrets.client_secret,
         audience: context.webtask.secrets.audience },
      json: true };

  request(tokenOptions, function(error, response, body) {
    if (error) throw new Error(error);

    const postData = JSON.stringify({
      'userId': 'auth0|' + user.id,
      'firstName': user.user_metadata.name,
      'lastName': user.user_metadata.surname,
      'email': user.email,
      'acceptedTerms': user.user_metadata.acceptedTerms,
      'initialAllowContactMe': user.user_metadata.allowContactMe
    });

    const options = { method: 'POST',
      url: 'https://' + context.webtask.secrets.hostname + context.webtask.secrets.path,
      headers: {
        'Authorization': 'Bearer ' + body.access_token,
        'Content-Type': 'application/json'
      },
      body: postData
    };

    request(options, function(error, response, body) {
      if (error) throw new Error(error);
    })
  });  

  console.log('User is created Hook finished');
  cb();
};
