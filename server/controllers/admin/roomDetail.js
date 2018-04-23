import {sequelize} from '../../model/index';
  
  export default async (ctx, next) => {
    var responseData={
      code:1,
      msg:"查询影厅信息失败"
    };
    //查询影厅基本信息
    await sequelize.query(`SELECT * FROM filmroom WHERE roomId=${ctx.query.roomId}`).then(res=>{
      if(res[0].length>0)
      {
          responseData={
          code:0,
          msg:'查询影厅信息成功',
          data:res[0][0]
        };
      }
    });
    ctx.body=responseData;
  }

