const Koa = require('koa')
// const bodyParser = require('koa-bodyparser')

const indexRoutes = require('./routes/index')
const movieRoutes = require('./routes/movies')

const app = new Koa()
const PORT = process.env.PORT || 4000

// app.use(bodyParser())
app.use(indexRoutes.routes())
app.use(movieRoutes.routes())

const server = app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
})

module.exports = server
// app.use(ctx => {
//   ctx.body = 'Hello Koa'
// })
//
// app.listen(3000)
