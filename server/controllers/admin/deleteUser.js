import {sequelize} from '../../model/index';
  
  export default async (ctx, next) => {
    var responseData={
      code:1,
      msg:"删除用户失败"
    };
    let deletedAt = new Date();
    await sequelize.query('UPDATE user SET deletedAt = ? WHERE userId=?',{
      replacements:[deletedAt,ctx.query.userId]
    }).then(res=>{
      if(res[0].affectedRows>0)
      {
        responseData={
          code:0,
          msg:'删除用户成功'
        };
      }
    })
    ctx.body=responseData;
  }

