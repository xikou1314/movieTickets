import {sequelize} from '../../model/index';
  
  export default async (ctx, next) => {
    var responseData={
      code:1,
      msg:"查询用户信息失败"
    };
    //查询用户角色信息
      var roles=[];
    await sequelize.query("SELECT * FROM usertorole WHERE userId=? AND deletedAt is null",{
        replacements:[ctx.query.userId]
    }).then(result=>{
        if(result[0].length>0)
        {
            roles=result[0];
        }
    }).catch(err=>{
        console.log(err);
    })
    //查询电影基本信息
    await sequelize.query(`SELECT * FROM user WHERE userId=${ctx.query.userId}`).then(res=>{
      if(res[0].length>0)
      {
          responseData={
          code:0,
          msg:'查询用户信息成功',
          data:res[0][0],
          role:roles
        };
      }
    });

    ctx.body=responseData;
  }

