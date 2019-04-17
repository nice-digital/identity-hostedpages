function loginByEmail(email, callback) {
  const request = require('request');

  request.post({
    url: configuration.niceaccountsurl,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    form: {
      'username': email,
      'apikey': configuration.niceaccountsapikey,
      'wtrealm': configuration.niceaccountswtrealm
    }
  }, function(err, response, body) {
    if (err) return callback(err);
    if (response.statusCode === 401 || 
        response.statusCode === 204) return callback();

    const user = JSON.parse(body);

    callback(null, {
      user_id: user.user_id.toString(),
      nickname: user.nickname,
      email: user.email
    });
  });
}