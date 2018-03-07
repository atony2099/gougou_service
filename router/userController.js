const {controller, get,post} = require('../lib/decorator')
const {getCode,verifyCode} = require('../service/user')

@controller('/user')
export class User {
  @get('/code')
  async getVerifyCode (ctx, next) {
    // console.log("curent====ctx",ctx);
    try {
      let verifyCode = await getCode(ctx)
      ctx.body = {
        success: true,
        verifyCode
      }
    } catch (e) {
      console.log("error",e);
      ctx.body = {
        success: false,
        err:'短信服务异常'
      }
    }
  }


  @get('/verify')
  async verifyCode(ctx,next) {
      try {
        let user = await verifyCode(ctx)
        if (user) {
          ctx.body = {
            user
          }
        }else {
          ctx.body = {
            success:false,
            err:'手机号或者验证码为空'
          }
        }
      } catch (e) {

        console.log("has error",e);
        ctx.body = {
          success: false,
          err:'验证失败'
        }
      }
  }

}
