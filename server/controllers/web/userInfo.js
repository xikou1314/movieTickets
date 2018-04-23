import {sequelize} from '../../model/index';

  export default async (ctx, next) => {
    var responseData={
      code:0,
      msg:"查询用户信息失败"
    };
    await sequelize.query("SELECT * FROM user WHERE userId=? AND deletedAt is null",{
      replacements:[ctx.request.query.userId]
    }).then(result=>{
      console.log(result);
      responseData={
        code:1,
        msg:"查询用户信息成功",
        data:result[0]
      }
    })
    ctx.body = responseData;

  }

