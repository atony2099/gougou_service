
var xss = require('xss')
var mongoose = require('mongoose')
const uuidv4 = require('uuid/v4');



export const getCode  =  async (ctx) => {
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

  console.log("ctx === body", ctx.request,ctx.request.body);
  let {phoneNumber,verifyCode} = ctx.request.body
  var user = await User.findOne({
    phoneNumber,
    verifyCode
  });
  if (!user) {
    return ;
  }
  // 获取验证码 ===
  let accessToken = uuidv4();
  user.accessToken =  accessToken;
  await user.save()
  return {user,accessToken};
}
