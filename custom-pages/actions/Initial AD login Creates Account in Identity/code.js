// @ts-nocheck
/**
* Handler that will be called during the execution of a PostLogin flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/

exports.onExecutePostLogin = async (event, api) => {

    //this rule is only concerned with migrating people who sign in for the first time with AD
    //or google.
    if ((event.connection.strategy !== "waad" && 
         event.connection.strategy !== "google-oauth2")){
      console.log(event.connection.strategy);
      return;
    } 
  
    const isInIdentityDB =  !!(event.user.user_metadata && event.user.user_metadata.isInIdentityDB);
  
    if (isInIdentityDB){
      console.log('Initial AD Login creates account in Identity - User already in identity db');
      return;
    }
    else{
  
      console.log('Initial AD Login creates account in Identity - Creating user in Identity db');
      
      var tokenResponse, tokenResponseBody
  
      const params = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: event.secrets.client_id,
        client_secret: event.secrets.client_secret,
        audience: event.secrets.audience
      });
  
      try {
        const tokenPromise = await fetch(event.secrets.gettokenpath, {
            method: "POST",
            headers: {
              'Content-Type': "application/x-www-form-urlencoded"
            },
            body: params.toString()
          });
  
        tokenResponse = await tokenPromise;
        tokenResponseBody = await tokenPromise.json();
  
      } catch(error) {
        console.log(error);
        throw error;
      }
      
      if (tokenResponse.status != "200") {
        let errorMessage = `Error in token call: HTTPCode - ${tokenResponse.status} | Error - ${tokenResponseBody.error} | Description - ${tokenResponseBody.error_description}`
        console.log(errorMessage);
        throw new Error(errorMessage);
      }
      console.log('Initial AD Login creates account in Identity - Token Request Successful');
  
      const postData = JSON.stringify({
          'nameIdentifier': event.user.user_id,
          'firstName': event.user.given_name,
          'lastName': event.user.family_name,
          'emailAddress': event.user.email,
          'acceptedTerms': false,
          'allowContactMe': false,
          'hasVerifiedEmailAddress': true,
          'isLockedOut': false,
          'isMigrated': false,
          'isStaffMember': event.connection.strategy === "waad",
          'isInAuthenticationProvider': true
        });
  
      var url = 'https://' + event.secrets.hostname + event.secrets.createuserspath;
      console.log(`AD user posting to: ${url} with data: ${postData}`);
  
      var addUserResponse
  
      try {
        const addUserPromise = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + tokenResponseBody.access_token,
            'content-type' : 'application/json'
          },
          body: postData
          });
  
        addUserResponse = await addUserPromise;
  
      } catch(error) {
        console.log(error);
        throw error;
      }
  
      if (addUserResponse.status != "201") {
        let errorMessage = `Error in add user call: HTTPCode - ${addUserResponse.status} | Status - ${addUserResponse.statusText}`
        console.log(errorMessage);
        throw new Error(errorMessage);
      }
  
      //user created in identity db, so set a flag in user metadata here
      event.user.user_metadata = event.user.user_metadata || {};
      event.user.user_metadata.isInIdentityDB = event.user.user_metadata.isInIdentityDB || true;
  
      try {
          api.user.setUserMetadata(event.user.user_id, event.user.user_metadata)
      } catch(err) {
        console.log('Initial AD Login creates account in Identity - Error setting user metadata');
        throw err;
      }
  
      console.log('Initial AD Login creates account in Identity - User created and metadata set');
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
  