import {sequelize} from '../../model/index';
const jwt = require('jsonwebtoken');
const util = require('util');
const verify = util.promisify(jwt.verify); // 解密

  export default async (ctx, next) => {
    var responseData={
      code:1,
      msg:'密码修改失败'
    };
    var userId = ctx.request.body.userId || '',
    loginPwd = ctx.request.body.loginPwd || '',
    loginPwdOld = ctx.request.body.loginPwdOld || '';
    var flag=false;
    //验证原密码输入是否正确
    await sequelize.query('SELECT * FROM user WHERE userId = ? AND password = ?',
    { replacements: [userId,loginPwdOld], type: sequelize.QueryTypes.SELECT }
    ).then(function(result){
      if(result.length>0)
      {
        flag=true;
      }
    }).catch(function(err)
    {
      responseData={
        code:2,
        msg:'原密码验证失败'
      };
    });
    if(flag)
    {
      let date=new Date();
    await sequelize.query('UPDATE user SET password = ?,updatedAt = ? WHERE userId = ?',    { replacements: [loginPwd,date,userId]}).then(function(result){
          if(result[0].affectedRows>0)
          {
            responseData={
              code:0,
              msg:'密码修改成功'
            };
          }
        })
    }
     
  
    ctx.body = responseData;

  }
  


