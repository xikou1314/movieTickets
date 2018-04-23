import {sequelize} from '../../model/index';
  
  export default async (ctx, next) => {
    var responseData={
      code:1,
      msg:"删除排片失败"
    };
    let deletedAt = new Date();
    await sequelize.query('UPDATE arrange SET deletedAt = ? WHERE arrangeId=?',{
      replacements:[deletedAt,ctx.query.arrangeId]
    }).then(res=>{
      if(res[0].affectedRows>0)
      {
        responseData={
          code:0,
          msg:'删除排片成功'
        };
      }
    })
    ctx.body=responseData;
  }

