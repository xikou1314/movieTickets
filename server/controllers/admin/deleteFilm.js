import {sequelize} from '../../model/index';
  
  export default async (ctx, next) => {
    var responseData={
      code:1,
      msg:"删除电影失败"
    };
    let deletedAt = new Date();
    await sequelize.query('UPDATE film SET deletedAt = ? WHERE filmId=?',{
      replacements:[deletedAt,ctx.query.filmId]
    }).then(res=>{
      if(res[0].affectedRows>0)
      {
        responseData={
          code:0,
          msg:'删除电影成功'
        };
      }
    })
    ctx.body=responseData;
  }

