const router = require('koa-router')()
const jwt = require('jwt-simple');
const { userlogin, userList, getUser, addUser, updateUser } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const jwtSecret = require('../conf/jwtConf')
const jwtauth = require('../middleware/jwtauth')

router.prefix('/api/user')

router.post('/login', async (ctx, next) => {
  const { username, password } = ctx.request.body
  const data = await userlogin(username, password)
  if (data.username) {
    const tokenExpiresTime = 2 * 60 * 60 * 1000;
    const payload = data
    const token = jwt.encode({
      iss: payload,
      exp: Date.now() + tokenExpiresTime,
    }, jwtSecret)

    data.token = token

    ctx.body = new SuccessModel(data, '登录成功')
  } else {
    ctx.body = new ErrorModel('登录失败')
  }
})


// 退出登录
router.post('/logout', async (ctx, next) => {
  ctx.body = new SuccessModel(true, '退出登录成功')
});

// 新增用户
router.post('/new', jwtauth, async (ctx, next) => {
  const { username, password, realname } = ctx.request.body
  const data = await addUser(username, password, realname)

  if (data.id > 0) {
    ctx.body = new SuccessModel(data)
  } else {
    ctx.body = new ErrorModel('用户名已存在！')
  }
});

module.exports = router
