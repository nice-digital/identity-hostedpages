function (user, context, callback) {
  
  const stringify = require("stringify-object");

  console.log("hitting the rule which is hit when a user logs in with AD for the first time");
    
  //this rule is only concerned with migrating people who sign in for the first time with AD
  //or google.
  if ((context.connectionStrategy !== "waad" && 
       context.connectionStrategy !== "google-oauth2")|| context.stats.loginsCount > 1){
    callback(null, user, context);  
    return;
  } 

  console.log('Login firsttime for AD user with Rule hit');

  const request = require("request");

  var tokenOptions = { method: 'POST',
    url: 'https://' + configuration.hostname + configuration.gettokenpath,
    headers: { 'content-type': 'application/json' },
    body: 
     { grant_type: 'client_credentials',
       client_id: configuration.client_id,
       client_secret: configuration.client_secret,
       audience: configuration.audience },
    json: true };

  request(tokenOptions, function (error, response, body) {
   if (error) throw new Error(error);

    const postData = JSON.stringify({
        'userId': user.user_id,
        'firstName': user.given_name,
        'lastName': user.family_name,
        'email': user.email,
        'acceptedTerms': false,
        'initialAllowContactMe': false
      });

    const options = { method: 'POST',
      url: 'https://' + configuration.hostname + configuration.createuserspath,
      headers: {
        'Authorization': 'Bearer ' + body.access_token,
        'content-type' : 'application/json'
      },
      body: postData
    };

    request(options, function(error, response, body){
      if (error) throw new Error(error);
    });
  });

  console.log('Login firsttime for AD user with Rule finished');
  callback(null, user, context); 
}