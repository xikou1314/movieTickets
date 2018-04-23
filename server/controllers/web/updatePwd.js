import {sequelize} from '../../model/index';
const jwt = require('jsonwebtoken');


  export default async (ctx, next) => {
    let  responseData={
        code:1,
        msg:"密码修改失败"
    };
    let confirmOld=false;
    //验证旧密码
    const {userId,oldPwd,newPwd}=ctx.request.body;
    await sequelize.query("SELECT * FROM user WHERE userId=? AND password=?",{
      replacements:[userId,oldPwd,newPwd]
    }).then(result=>{
        console.log(result);
        if(result[0].length>0)
        {
          confirmOld=true;
        }
    })
    if(confirmOld){
      //修改密码
      await sequelize.query("UPDATE user SET password=? WHERE userId=?",{
        replacements:[newPwd,userId]
      }).then(result=>{
        if(result[0].affectedRows>0)
        {
          responseData={
            code:0,
            msg:'修改密码成功'
          };
        }
      })
    }
    ctx.body = responseData;

  }

