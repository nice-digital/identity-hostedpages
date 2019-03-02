function login(email, password, callback) {
  const request = require('request');

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
  }, function(err, response, body) {
    if (err) return callback(err);
    if (response.statusCode === 401 ||
        response.statusCode === 403 || 
        response.statusCode === 204) 
      return callback(new WrongUsernameOrPasswordError(email));
    
    const user = JSON.parse(body);

    callback(null, {
      user_id: user.user_id.toString(),
      nickname: user.nickname,
      email: user.email,
      user_metadata: {firstname: user.given_name, lastname: user.family_name}
    });
  });
}
