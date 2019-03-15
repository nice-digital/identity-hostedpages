function (user, context, callback) {

  //this rule is only concerned with migrating people who sign in for the first time with AD.
  if (context.connectionStrategy !== "waad" || context.stats.loginsCount > 1){
    callback(null, user, context);  
  } else{
    
    console.log(`connectionStrategy: ${context.connectionStrategy}`);
    console.log(`login count: ${context.stats.loginsCount}`);
  
    console.log('Login firsttime for AD user with Rule hit');
    console.log(`user: ${JSON.stringify(user)}`);
    console.log(`context: ${JSON.stringify(context)}`);
  
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
      port: configuration.port,
      path: configuration.createuserspath,
      method: 'POST',   
      headers: {
        'x-api-key': configuration.apikey,
        'Content-Type': 'application/json'
      }
    };

    console.log(`hostname:${options.hostname} port:${options.port} path: ${options.path}`);

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
  
    callback(null, user, context);
  }
}