import {sequelize} from '../../model/index';
const jwt = require('jsonwebtoken');

  var responseData={};
  export default async (ctx, next) => {

    await sequelize.transaction(function (t1) {
      // 启用 CLS 后，将在事务中创建用户
      return sequelize.query("SELECT * FROM user WHERE userName='admin'").then(res=>{
        console.log(res);
        return sequelize.query("UPDATE user SET password='12345' WHERE userName='admin'").then(res=>{
          console.log(res);
          // throw new Error();
        })
      })
    }).then(res=>{
      responseData={
        msg:"事务提交"
      }
    }).catch(err=>{
      responseData={
        msg:"事务回滚"
      }
    });

    ctx.body = responseData;

  }

