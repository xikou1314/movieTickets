import {sequelize} from '../../model/index';
  
  export default async (ctx, next) => {
    var responseData={
      code:1,
      msg:"修改用户信息失败"
    };
    const {name,phone,email,avatar,userId}=ctx.request.body;
    let date=new Date();
    await sequelize.query("UPDATE user SET name=?,phone=?,email=?,avatar=?,updatedAt=? WHERE userId=?",{
      replacements:[name,phone,email,avatar,date,userId]
    }).then(result=>{
      if(result[0].affectedRows>0)
      {
        responseData={
          code:0,
          msg:'修改用户信息成功'
        };
      }
    });
    ctx.body=responseData;
  }

