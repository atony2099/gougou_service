const glob = require('glob')
const mongoose = require('mongoose')
const {resolve} = require('path')

const db = 'mongodb://localhost/gougou-server'




// add
exports.initSchemas = () => {
  let fileArrays  = glob.sync(resolve(__dirname, './schema', '**/*.js'))
  fileArrays.forEach(require)
}

exports.connect = () => {

  return new Promise((resolve,reject) => {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }

    var maxConnectTimes = 0;

    // 连接数据库
    mongoose.connect(db)
    mongoose.connection.on('disconnected', () => {
    maxConnectTimes++
    if (maxConnectTimes < 5) {
      mongoose.connect(db)
    } else {
      reject(new Error('数据库没有连接，快去修吧少年'))
    }
  })

  mongoose.connection.on('error', err => {
    maxConnectTimes++
    if (maxConnectTimes < 5) {
      mongoose.connect(db)
    } else {
      reject(new Error('数据库挂了吧，快去修吧少年'))
    }
  })
  mongoose.connection.once('open', ()=> {
    resolve();
    console.log("数据库连接成功");

  })




  })

}
