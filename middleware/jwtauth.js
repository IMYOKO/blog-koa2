const jwt = require('jwt-simple');
const jwtSecret = require('../conf/jwtConf')
const { getUser } = require('../controller/user')
const { ErrorModel } = require('../model/resModel')

module.exports = async (ctx, next) => {
  //todo
  var token = (ctx.request.body && ctx.request.body.access_token) || (ctx.query && ctx.query.access_token) || ctx.headers['x-access-token']
  console.log('token: ', token)
  if (token) {
    try {
      var decoded = jwt.decode(token, jwtSecret);
      //todo  handle token here
      console.log('decoded: ', decoded)
      if( decoded.exp <= Date.now()) {
        ctx.body = new ErrorModel('token过期')
      }
      ctx.iss = decoded.iss;
      const data = await getUser(ctx.iss.id)
      if (data.id) {
        await next()
      } else {
        ctx.body = new ErrorModel('token无效')
      }
    } catch (err) {
      await next()
    }
  } else {
    await next()
  }
}