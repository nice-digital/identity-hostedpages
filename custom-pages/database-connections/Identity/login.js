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
		if (err) return callback(err);
		if (response.statusCode === 401 ||
			response.statusCode === 403 ||
			response.statusCode === 204)
				return callback(new WrongUsernameOrPasswordError(email));
			
		const user = JSON.parse(body);
		
		//create the user in NICE's identity DB here
		(function (user) {
			var tokenOptions = { method: 'POST',
		      url: 'https://' + configuration.appdomain + configuration.gettokenpath,
		      headers: { 'content-type': 'application/json' },
		      body: 
		       { grant_type: 'client_credentials',
		         client_id: configuration.client_id,
		         client_secret: configuration.client_secret,
		         audience: configuration.audience },
		      json: true };

			request(tokenOptions, function(error, response, body) {
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
						'Content-Type': 'application/json'
					},
					body: postData
				};

				request(options, function(error, response, body) {
					if (error) throw new Error(error);
				});
			});

			console.log('create the user in NICEs identity DB script finished');

		})(user);

		//return the user for Auth0 to store   
		callback(null, {
			user_id: user.user_id.toString(),
			nickname: user.nickname,
			email: user.email,
			user_metadata: { firstname: user.given_name, lastname: user.family_name }
		});
	});
}
