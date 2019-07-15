const router = require('koa-router')()
const { getList, getDetail, newBlog, updateBlog, deleteBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const jwtauth = require('../middleware/jwtauth')

router.prefix('/api/blog')

router.get('/list', jwtauth, async (ctx, next) => {
  let author = ctx.query.author || ''
  const keyword = ctx.query.keyword || ''
  if (ctx.query.isadmin) {
    if (ctx.iss.username == null) {
      ctx.body = new ErrorModel('尚未登录')
      return
    }
    author = ctx.iss.username
  }
  const listData = await getList(author, keyword)
  ctx.body = new SuccessModel(listData)
})

router.get('/detail', jwtauth, async (ctx, next) => {
  const detailData = await getDetail(ctx.query.id)
  ctx.body = new SuccessModel(detailData)
})

router.post('/new', jwtauth, async (ctx, next) => {
  ctx.request.body.author = ctx.iss.username
  const blogData = await newBlog(ctx.request.body)
  ctx.body = new SuccessModel(blogData, '新增博客成功')
})

router.post('/update', jwtauth, async (ctx, next) => {
  const { title, content } = ctx.request.body
  const result = await updateBlog(ctx.query.id, title, content)
  if (result) {
    ctx.body = new SuccessModel(result, '更新博客成功')
  } else {
    ctx.body = new ErrorModel('更新博客失败')
  }
})

router.post('/delete', jwtauth, async (ctx, next) => {
  const author = ctx.iss.username
  const result = await deleteBlog(ctx.iss.id, author)
  if (result) {
    ctx.body = new SuccessModel(val, '删除成功')
  } else {
    ctx.body = new ErrorModel('删除博客失败')
  }
})

module.exports = router
