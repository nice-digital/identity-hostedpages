function (user, context, callback) {
  
  const stringify = require("stringify-object");

  console.log("hitting the rule which is hit when a user logs in with AD for the first time");
    
  //this rule is only concerned with migrating people who sign in for the first time with AD
  //or google.
  if ((context.connectionStrategy !== "waad" && 
       context.connectionStrategy !== "google-oauth2")){ //|| context.stats.loginsCount > 1
    callback(null, user, context);  
    return;
  } 

  const isInIdentityDB =  !!(user.user_metadata && user.user_metadata.isInIdentityDB);

  if (isInIdentityDB){
    console.log('Login firsttime for AD user with Rule hit - user already in identity db');
    callback(null, user, context); 
  }
  else{

    console.log('Login firsttime for AD user with Rule hit - and user not in identity db');

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
      console.log('Login firsttime AD/google rule  - error in token call');
        throw new Error(error);
      }

      console.log('Login firsttime AD/google rule  - after token request');
      const postData = JSON.stringify({
          'nameIdentifier': user.user_id,
          'firstName': user.given_name,
          'lastName': user.family_name,
          'emailAddress': user.email,
          'acceptedTerms': false,
          'allowContactMe': false,
          'hasVerifiedEmailAddress': true,
          'isLockedOut': false,
          'isMigrated': false,
          'isStaffMember': context.connectionStrategy === "waad",
          'isInAuthenticationProvider': true
        });

      var url = 'https://' + configuration.hostname + configuration.createuserspath;
      console.log('AD user posting to: ' + url + ' data:' + stringify(postData));
      
      const options = { method: 'POST',
        url: url,
        headers: {
          'Authorization': 'Bearer ' + body.access_token,
          'content-type' : 'application/json'
        },
        body: postData
      };

      request(options, function(error, response, body){
        if (error) {
          console.log('Login firsttime AD/google rule  - error in create user call');
          throw new Error(error);
        }
        //user created in identity db, so set a flag in user metadata here
        user.user_metadata = user.user_metadata || {};
        user.user_metadata.isInIdentityDB = user.user_metadata.isInIdentityDB || true;

        auth0.users.updateUserMetadata(user.user_id, user.user_metadata)
        .then(function(){
          console.log('Login firsttime AD/google rule  - after create user');
          callback(null, user, context); 
        })
        .catch(function(err){
          console.log('Login firsttime AD/google rule  - error in create user call');
          throw new Error(err);
        });      
      });
    });
  }
  console.log('Login end of scripts - outside of requests');
}
