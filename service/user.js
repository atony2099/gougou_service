
var xss = require('xss')
var mongoose = require('mongoose')
const uuidv4 = require('uuid/v4');



export const getCode  =  async (ctx) => {
  // xss攻击
  var User = mongoose.model('User')
  let {phoneNumber} = ctx.query
  phoneNumber = xss(phoneNumber.trim())
  var  user =   await User.findOne({
        phoneNumber
  })
  // get code
  let verifyCode = phoneNumber

  if (!user) {
    user  = new User({
        phoneNumber,
        verifyCode
    })
  }else {
    user.verifyCode = verifyCode
  }

  await user.save()

  return verifyCode
}


export const verifyCode = async (ctx) => {
  var User = mongoose.model('User')
  console.log("ctx === body", ctx.query);
  let {phoneNumber,verifyCode} = ctx.query

  var user = await User.findOne({
    phoneNumber,
    verifyCode
  });
  if (!user) {
    return ;
  }
  // 获取验证码 ===
  user.accessToken =  uuidv4()
  await user.save()
  return user;
}
