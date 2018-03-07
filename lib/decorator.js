const Router = require('koa-router')
const { resolve } = require('path')
const symbolPrefix = Symbol('prefix')
const routerMap = new Map()
const glob = require('glob')


const normalizePath = path => path.startsWith('/') ? path : `/${path}`
export class Route {
  constructor (app,apiPath){
    this.app = app;
    this.apiPath = apiPath;
    this.router =  new Router();
  }

  init(){
    // 加载
    glob.sync(resolve(this.apiPath,'./**/*.js')).forEach(require)
    for (let [conf,func] of routerMap) {
      let {targetClass,path,methods} = conf;
      console.log("kkk",targetClass,path,methods,func);
      // ========
      // path = normalizePath(path)
      // prepath
      console.log("targetClass is",targetClass,typeof(targetClass));
      let prefixPath = targetClass[symbolPrefix];
      console.log(prefixPath,"prefixPath ===");
      // if (prefixPath)  {let prefixPath = normalizePath(prefixPath)}
      // lastpath
      let routerPath =  prefixPath + path
      console.log("===",prefixPath,path,routerPath);
      // function
      this.router[methods](
        routerPath, func
      )

      // console.log(this.router,this.router.path,"router is");
    }

    this.app.use(this.router.routes())
    this.app.use(this.router.allowedMethods())
  }
}

// 注入
export const controller = prePath => target => (target.prototype[symbolPrefix] = prePath)

const router = conf => (target, key, descriptor) => {
  routerMap.set({
    targetClass: target,
    ...conf
  }, target[key])
}

export const get = path => router({
    methods:'get',
    path
})

export const post = path => router({
    methods:'post',
    path
})
