import {sequelize} from '../../model/index';
  
  export default async (ctx, next) => {
    var responseData={
      code:1,
      msg:"查询排片信息失败"
    };
    //查询信息
    await sequelize.query("SELECT * FROM arrange,film,filmroom WHERE arrange.filmId=film.filmId AND arrange.roomId=filmroom.roomId AND arrange.deletedAt is null AND arrangeId=?",
  {
    replacements:[ctx.request.query.arrangeId]
  }).then(res=>{
      if(res[0].length>0)
      {
          responseData={
          code:0,
          msg:'查询排片信息成功',
          data:res[0][0]
        };
      }
    });

    ctx.body=responseData;
  }

