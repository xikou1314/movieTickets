import {sequelize} from '../../model/index';
  
  export default async (ctx, next) => {
    var responseData={
      code:1,
      msg:"删除影厅失败"
    };
    let deletedAt = new Date();
    await sequelize.query('UPDATE filmroom SET deletedAt = ? WHERE roomId=?',{
      replacements:[deletedAt,ctx.query.roomId]
    }).then(res=>{
      if(res[0].affectedRows>0)
      {
        responseData={
          code:0,
          msg:'删除影厅成功'
        };
      }
    })
    ctx.body=responseData;
  }

