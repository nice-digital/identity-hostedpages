function addAttributes(user, context, callback) {
    console.log("hitting the rule which adds google analytics to claims");
  	console.log(context.request.query);
  	if(context.request.query) {
        context.idToken['http://nice.org.uk/tempCid'] = context.request.query.temp_cid;
    }
    callback(null, user, context);
    console.log("end of rule which adds google analytics to claims");
  }