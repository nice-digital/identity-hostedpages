// @ts-nocheck
/**
* Handler that will be called during the execution of a PostUserRegistration flow.
*
* @param {Event} event - Details about the context and user that has registered.
* @param {PostUserRegistrationAPI} api - Methods and utilities to help change the behavior after a signup.
*/
exports.onExecutePostUserRegistration = async (event, api) => {

    console.log("Create IDAM User - action started");
      
    var tokenResponse, tokenResponseBody;
  
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: event.secrets.client_id,
      client_secret: event.secrets.client_secret,
      audience: event.secrets.audience
    });
  
    try {
      tokenResponse = await fetch(event.secrets.gettokenpath, {
          method: "POST",
          headers: {
            'Content-Type': "application/x-www-form-urlencoded"
          },
          body: params.toString()
        });
  
      tokenResponseBody = await tokenResponse.json();
  
    } catch(error) {
      console.log(`Create IDAM User - Error Fetching Token: ${error}`);
      throw error;
    }
    
    if (tokenResponse.status != "200") {
      let errorMessage = `Error in token call: HTTPCode - ${tokenResponse.status} | Error - ${tokenResponseBody.error} | Description - ${tokenResponseBody.error_description}`;
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
  
    console.log("Create IDAM User - Token aquired, sending data to NICE identity api");
  
    let firstName = event.user && event.user.user_metadata && event.user.user_metadata.name ? event.user.user_metadata.name : null;
    let lastName = event.user && event.user.user_metadata && event.user.user_metadata.surname ? event.user.user_metadata.surname : null;
    let acceptedTerms = event.user && event.user.user_metadata && event.user.user_metadata.acceptedTerms ? event.user.user_metadata.acceptedTerms : "false";
    let allowContactMe = event.user && event.user.user_metadata && event.user.user_metadata.allowContactMe ? event.user.user_metadata.allowContactMe : "false";
  
    // The acceptedTerms and allowContactMe fields need to be strings in the hosted pages due to
    // auth0 only accepting strings in the user_metadata sent to the user signup endpoint.
    // They need to be converted to booleans before calling the Identity API
    // https://auth0.com/docs/best-practices/metadata-best-practices#metadata-storage-and-size-limits
  
    acceptedTerms = (acceptedTerms.toLowerCase() === 'true') ? true : false;
    allowContactMe = (allowContactMe.toLowerCase() === 'true') ? true : false;
  
    let hasVerifiedEmailAddress = false;
    let isLockedOut = false;
    let isMigrated = false;
    let isStaffMember = event.user.email.indexOf("@nice.org.uk") !== -1;
  
    const postData = JSON.stringify({
      'nameIdentifier': 'auth0|' + event.user.id,
      'firstName': firstName,
      'lastName': lastName,
      'emailAddress': event.user.email,
      'acceptedTerms': acceptedTerms,
      'allowContactMe': allowContactMe,
      'hasVerifiedEmailAddress': hasVerifiedEmailAddress,
      'isLockedOut': isLockedOut,
      'isMigrated': isMigrated,
      "isStaffMember": isStaffMember,
      'isInAuthenticationProvider': true
    });
  
    var addUserResponse;
  
    try {
      addUserResponse = await fetch('https://' + event.secrets.hostname + event.secrets.createuserspath, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + tokenResponseBody.access_token,
          'content-type' : 'application/json'
        },
        body: postData
        });
  
    } catch(error) {
      console.log(`Create IDAM User - Identity api error: ${error}`);
      throw error;
    }
  
    if (addUserResponse.status != "201") {
      let errorMessage = `Create IDAM User - Error in add user call: HTTPCode - ${addUserResponse.status} | Status - ${addUserResponse.statusText}`;
      console.log(errorMessage);
      throw new Error(errorMessage);
    }
  
    console.log("Create IDAM User - action completed");
  
    return;
  };
  