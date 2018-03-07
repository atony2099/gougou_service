
const { Route } = require('../lib/decorator')
const { resolve } = require('path')

export const  router =  app => {

  const folder = resolve(__dirname,'../router')
  let route = new Route(app,folder);
  //
  route.init() // 实例话path
}
