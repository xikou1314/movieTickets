import {sequelize} from '../../model/index';
const jwt = require('jsonwebtoken');
const util = require('util');
const verify = util.promisify(jwt.verify); // 解密

  export default async (ctx, next) => {
    var responseData={
      code:1,
      msg:'排片修改失败'
    };
    var now=new Date();
    const {arrangeId,filmId,roomId,date,start,end,price}=ctx.request.query;
    await sequelize.query("UPDATE arrange SET roomId=?,date=?,start=?,end=?,price=?,updatedAt=? WHERE arrangeId=?",{
      replacements:[roomId,date,start,end,price,now,arrangeId]
    }).then(result=>{
      if(result[0].affectedRows>0)
      {
        responseData={
          code:0,
          msg:'排片修改成功'
        };
      }
    }).catch(err=>{
      console.log(err);
    })

  
    ctx.body = responseData;

  }
  


