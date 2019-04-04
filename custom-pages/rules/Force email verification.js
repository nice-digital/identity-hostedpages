function (user, context, callback) {
  if (!user.email_verified && context.protocol !== 'oauth2-password' && context.protocol !== 'oauth2-refresh-token' && context.protocol !== 'oauth2-resource-owner') {
    console.log('NOT VERIFIED CONTEXT:', context);
    console.log('USER: ',user);
    context.redirect = {
        url: `https://${context.request.hostname}/login?client=${context.request.query.client_id}&protocol=oauth2&redirect_uri=${context.request.query.redirect_uri}&response_type=${context.request.query.response_type}&scope=${encodeURIComponent(context.request.query.scope)}&response_mode=${context.request.query.response_mode}&nonce=${context.request.query.nonce}&x-client-SKU=${context.request.query["x-client-SKU"]}&x-client-ver=${context.request.query["x-client-ver"]}&myerrorcode=user_not_verified&myerror=${encodeURIComponent(new UnauthorizedError('Please verify your email before logging in.'))}&userid=${encodeURIComponent(user.user_id)}&email=${user.email}`
    };
    return callback(null, user, context);
    //return callback(new UnauthorizedError('Please verify your email before logging in.'), {user: null, context: null});
  } else {
    console.log('REGULAR PASS THROUGH WITH CONTEXT: ',context);
    return callback(null, user, context);
  }
}