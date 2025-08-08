function (user, context, callback) {
  
  console.log("hitting the rule which to add roles to the id token");
    
  //this rule for next.js clients which add the roles to the id token - as redis isn't supported by auth0/nextjs.

  const clientIdsToExecuteRuleFor = configuration.clientIdsToAddRolesCSV.split(',');

  if (!clientIdsToExecuteRuleFor.includes(context.clientID)){
    callback(null, user, context);  
    return;
  } 

  let idTokenClaims = context.idToken || {};
  let accessTokenClaims = context.accessToken || {};

  console.log("hitting the rule which to add roles to the id token - next js app found.");

  const request = require("request");

  var tokenOptions = { method: 'POST',
    url: configuration.gettokenpath,
    headers: { 'content-type': 'application/json' },
    body: 
    { grant_type: 'client_credentials',
      client_id: configuration.client_id,
      client_secret: configuration.client_secret,
      audience: configuration.audience },
    json: true };

  request(tokenOptions, function (error, response, body) {
  if (error){
    console.log('add roles to the id token rule  - error in token call');
      throw new Error(error);
    }

    console.log('add roles to the id token rule  - after token request');
    
    var url = 'https://' + configuration.hostname + '/api/claims/' + encodeURIComponent(user.user_id);
    console.log('GET claims from: ' + url);
    
    const options = { method: 'GET',
      url: url,
      headers: {
        'Authorization': 'Bearer ' + body.access_token,
        'content-type' : 'application/json'
      }
    };

    request(options, function(error, response, body){
      if (error || response.statusCode !== 200) {
        console.log('add roles to the id token  - error in create user call');
        throw new Error(error);
      }
      
      const claims = JSON.parse(body);
      
      var applicationMetadata = context.clientMetadata;

      if (applicationMetadata && applicationMetadata.role_issuers){

        const role_issuers = applicationMetadata.role_issuers.split(',');

        const roleType = "http://identity.nice.org.uk/claims/role";
        
        const rolesToAdd = claims.filter(role => role.type === roleType && 
                                               role_issuers.includes(role.issuer));

        idTokenClaims[roleType] = rolesToAdd.map(r => r.value);
        accessTokenClaims[roleType] = rolesToAdd.map(r => r.value);

        context.idToken = idTokenClaims;      
        context.accessToken = accessTokenClaims;
      }      

      callback(null, user, context);  
    });
  });

  console.log('add roles to the id token - finished');
}
