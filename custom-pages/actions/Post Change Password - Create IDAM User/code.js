/**
* Handler that will be called during the execution of a PostChangePassword flow.
*
* @param {Event} event - Details about the user and the context in which the change password is happening.
* @param {PostChangePasswordAPI} api - Methods and utilities to help change the behavior after a user changes their password.
*/
exports.onExecutePostChangePassword = async (event, api) => {

  console.log("Post Change Password - action started");

  var tokenResponse, tokenResponseBody;

  const tokenRequestParams = new URLSearchParams({
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
        body: tokenRequestParams
      });

    tokenResponseBody = await tokenResponse.json();

  } catch(error) {
    console.log(`Create IDAM User - Error Fetching Token: ${error}`);
    throw error;
  }
  
  if (tokenResponse.status !== 200) {
    const errorMessage = `Error in token call: HTTPCode - ${tokenResponse.status} | Error - ${tokenResponseBody.error} | Description - ${tokenResponseBody.error_description}`;
    console.log(errorMessage);
    throw new Error(errorMessage);
  }
  
  console.log("Post Change Password - Checking to see if user exists in IDAM");

  var userExistsResponse;

  try {
    const usersEndpointURL = 'https://' + event.secrets.hostname + event.secrets.userspath;

    userExistsResponse = await fetch(usersEndpointURL + `?q=${encodeURI(event.user.email)}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + tokenResponseBody.access_token,
        'content-type' : 'application/json'
      }
    });

  } catch(error) {
    console.log(`Post Change Password - Check user exists in Identity api error: ${error}`);
    throw error;
  }

  if (userExistsResponse.status !== 200) {
    const errorMessage = `Post Change Password - Check user exists in Identity error: HTTPCode - ${userExistsResponse.status} | Status - ${userExistsResponse.statusText}`;
    console.log(errorMessage);
    throw new Error(errorMessage);
  }

  const userExistsBody = await userExistsResponse.text();
  const userExists = (Array.isArray(userExistsBody) && userExistsBody.length !== 0);

  if (userExists){
    console.log(`Post Change Password - Identity account for that user already exists: ${event.user.email}`);
    return;
  }
  
  //user doesn't exist. this could happen if the user has reset a password for a user that is in nice accounts
  console.log("Post Change Password - Checking NICE Accounts to see if user exists there");
  
  var checkNICEAccountsResponse;

  const niceAccountsParams = new URLSearchParams({
    username: event.user.email,
    apikey: event.secrets.niceAccountsAPIKey,
    wtrealm: event.secrets.niceAccountsRealm
  });

  try {

    checkNICEAccountsResponse = await fetch(event.secrets.niceAccountsEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: niceAccountsParams
    });

  } catch(error) {
    console.log(`Post Change Password - NICE Accounts error: ${error}`);
    throw error;
  }

  if (checkNICEAccountsResponse.status !== 200){
    const errorMessage = `Post Change Password - NICE Accounts error: HTTPCode - ${checkNICEAccountsResponse.status} | Status - ${checkNICEAccountsResponse.statusText}`;
    console.log(errorMessage);
    throw new Error(errorMessage);
  }
  
  //at this point nice accounts has returned a valid user, which doesn't exist in the idam db, so we just need to hit our db with the user.
  let user = JSON.parse(await checkNICEAccountsResponse.text())

  const postData = JSON.stringify({
    'nameIdentifier': `auth0|${user.user_id}`,
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
  
  var addUserResponse;

  try {
    const usersEndpointURL = 'https://' + event.secrets.hostname + event.secrets.userspath;

    addUserResponse = await fetch(usersEndpointURL, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + tokenResponseBody.access_token,
        'content-type' : 'application/json'
      }, 
      body: postData
      });

  } catch(error) {
    console.log(`Post Change Password - Error in add user call: ${error}`);
    throw error;
  }

  if (addUserResponse.status != "201") {
    const errorMessage = `Post Change Password - Error in add user call: HTTPCode - ${addUserResponse.status} | Status - ${addUserResponse.statusText}`;
    console.log(errorMessage);
    throw new Error(errorMessage);
  }

  console.log("post-change password user creation success");
};
