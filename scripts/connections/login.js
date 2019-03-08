function login(email, password, callback) {
	const request = require('request');

	console.log("lazy migrating");

	request.post({
		url: configuration.url,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Accept': 'application/json'
		},
		form: {
			'authenticate': true,
			'username': email,
			'password': password,
			'apikey': configuration.apikey,
			'wtrealm': configuration.wtrealm
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

			const https = require('https');

			console.log(JSON.stringify(user));

			const postData = JSON.stringify({
				'userId': user.user_id,
				'firstName': user.given_name,
				'lastName': user.family_name,
				'email': user.email,
				'acceptedTerms': false,
				'initialAllowContactMe': false
			});

			console.log(`post data: ${postData}`);

			const options = {
				hostname: configuration.hostname,
				//port: configuration.port,
				path: configuration.createuserspath,
				method: 'POST',
				headers: {
					'x-api-key': configuration.identityapikey,
					'Content-Type': 'application/json'
				}
			};

			console.log(`hostname:${options.hostname} path: ${options.path}`);

			const req = https.request(options, (res) => {
				console.log(`STATUS: ${res.statusCode}`);
				console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

				res.setEncoding('utf8');
				res.on('data', (chunk) => {
					console.log(`BODY: ${chunk}`);
				});
				res.on('end', () => {
					console.log('No more data in response.');
				});
			});

			req.on('error', (e) => {
				console.error(`problem with request: ${e.message}`);
			});

			// write data to request body
			req.write(postData);
			req.end();

			console.log('Login firsttime for AD user with Rule finished');

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
