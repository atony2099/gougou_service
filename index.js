var koa = require('koa')
var glob = require('glob')
var {resolve} = require('path')
var logger = require('koa-logger')
var session = require('koa-session')
var bodyParser = require('koa-bodyparser')
const {initSchemas,connect} = require('./database')
const R = require('ramda')


var app = new koa()
// init ====
;(async () => {
  // console.log("1111");
  initSchemas()
  await connect()
  useMiddlewares(app)
})()

const MIDDLEWARES = ['userRouterMiddle']
const useMiddlewares = (app) => {
  R.map(
    R.compose(
      R.forEachObjIndexed(
        initWith => initWith(app)
      ),
      require,
      name => resolve(__dirname, `./middleware/${name}`)
    )
  )(MIDDLEWARES)
}







// add 组件

app.use(logger())
app.use(session(app))
app.use(bodyParser())



app.listen(8080);
