function login(email, password, callback) {
	const request = require('request');

	console.log("lazy migrating");
	console.log('hitting script that creates the user in NICEs identity DB');

	request.post({
		url: configuration.niceaccountsurl,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Accept': 'application/json'
		},
		form: {
			'authenticate': true,
			'username': email,
			'password': password,
			'apikey': configuration.niceaccountsapikey,
			'wtrealm': configuration.niceaccountswtrealm
		}
	}, function (err, response, body) {
		if (err){ 
			console.log("Error calling nice accounts in login.js");
			return callback(err);
		}

		if (response.statusCode === 401 ||
			response.statusCode === 403 ||
			response.statusCode === 204){
			console.log("login.js lazy migrating returned:" + response.statusCode);
			return callback(new WrongUsernameOrPasswordError(email));
		}
		
		console.log('login.js script returned after nice account call. username + password must be valid. now to get a token to then call our api');

		let user = JSON.parse(body);
    	const userIdNoPrefix = user.user_id.toString();
    	user.user_id = "auth0|" + userIdNoPrefix;
		
		//create the user in NICE's identity DB here
		(function (user, userIdNoPrefix) {
			var tokenOptions = { method: 'POST',
		      url: configuration.gettokenpath,
		      headers: { 'content-type': 'application/json' },
		      body: 
		       { grant_type: 'client_credentials',
		         client_id: configuration.client_id,
		         client_secret: configuration.client_secret,
		         audience: configuration.audience },
		      json: true };

			request(tokenOptions, function(error, response, body) {
				if (error) {
					console.log("Error trying to get a token in login.js");
					throw new Error(error);
				}
		    
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
					'isInAuthenticationProvider': true
				});

				const options = { method: 'POST',
					url: 'https://' + configuration.hostname + configuration.createuserspath,
					headers: {
						'Authorization': 'Bearer ' + body.access_token,
						'Content-Type': 'application/json'
					},
					body: postData
				};
        
				console.log("hitting our api in login.js with postData:");         
				console.log(postData);      
				console.log(JSON.stringify(options));

				request(options, function(error, response, body) {
					if (error) {
						console.log('error storing user in api in login.js');
						console.log(error);         
						console.log(response);
						throw new Error(error);
					}
					console.log('create the user in NICEs identity DB script finished. Now returning user for auth0 to store');
					//return the user for Auth0 to store   
					callback(null, {
						user_id: userIdNoPrefix,
						nickname: user.nickname,
						email: user.email,
						email_verified: true,
						user_metadata: { firstname: user.given_name, lastname: user.family_name }
					});
				});
			});
		})(user, userIdNoPrefix);		
	});
}