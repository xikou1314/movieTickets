import {sequelize} from '../../model/index';

  export default async (ctx, next) => {
    var responseData={
      code:1,
      msg:"用户已存在"
    };
    var {userName} = ctx.request.query;
    await sequelize.query("SELECT * FROM user WHERE userName=?",{
      replacements:[userName]
    }).then(res=>{
      if(res[0].length===0){
        responseData={
          code:0,
          msg:"用户不存在"
        };
      }
    })

    ctx.body = responseData;

  }

