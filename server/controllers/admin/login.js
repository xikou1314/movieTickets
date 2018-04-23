import {sequelize} from '../../model/index';
const jwt = require('jsonwebtoken');

  var responseData={};
  export default async (ctx, next) => {

    var userName = ctx.request.body.userName || '',
    password = ctx.request.body.password || '';
    var userId=-1;
    await sequelize.query('SELECT * FROM user WHERE userName = ? AND password = ? AND deletedAt is null',
    { replacements: [userName,password], type: sequelize.QueryTypes.SELECT }
    ).then(function(result){
        if(result.length>0)
        {
            var userToken = {
                name: userName
            };
            var token = jwt.sign(userToken, "shared-secret", {expiresIn: '24h'}) 
            responseData={
                code:0,
                msg:"登录成功",
                data:{
                    user:{
                        name:result[0].name,
                        userId:result[0].userId
                        },
                    token:token
                },

            };
            userId=result[0].userId;

        }
        else{
            responseData={
                code:1,
                msg:"登录失败"
            };
        }

    }).catch(function(err){
        responseData={
            code:1,
            msg:"登录失败"
        };
    })
    if(userId!=-1)
    {
        var roles= [];
        await sequelize.query("SELECT * FROM usertorole,role WHERE userId=? AND usertorole.roleId=role.roleId AND usertorole.deletedAt is null",{
            replacements:[userId]
        }).then(result=>{
            for(var i=0;i<result[0].length;i++)
            {
              roles.push(result[0][i].roleId);
            }
          responseData.role = result[0];
        });
        var sql="("
        for(var i=0;i<roles.length;i++)
        {
          sql+="?,"
        }
        sql=sql.slice(0,-1)+")"
      // console.log(sql);
        //查询角色对应的模块
        await sequelize.query("SELECT * FROM permission,modle WHERE permission.modleId=modle.modleId AND permission.deletedAt is null AND roleId in "+sql,{
          replacements:roles
        }).then(result=>{
          console.log("模块信息");
          console.log(result[0]);
          responseData.modle=result[0];
        })
    }
    ctx.body = responseData;

  }

