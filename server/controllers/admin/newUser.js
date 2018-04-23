import {sequelize} from '../../model/index';

  export default async (ctx, next) => {
    var responseData={
      code:1,
      msg:"创建用户失败"
    };
    var date=new Date();
    var {userName,password,name,roleId,phone,email} = ctx.request.body;
    var userId=-1;
    await sequelize.query('INSERT INTO user VALUES(null,?,?,?,?,?,null,?,?,null)',{
      replacements:[userName,password,name,phone,email,date,date]
    }).then(res=>{
      userId=res[0];
    })
    if(userId!==-1)
    {
      var sql="INSERT INTO usertorole VALUES";
      var params=[];
      for(var i of roleId)
      {
        sql+="(null,?,?,?,?,null),"
        params.push(userId);
        params.push(i);
        params.push(date);
        params.push(date);
      }
      await sequelize.query(sql.slice(0,-1),{
        replacements:params
      }).then(res=>{
        responseData={
          code:0,
          msg:"创建用户成功"
        };
      })
    }
    ctx.body = responseData;

  }

