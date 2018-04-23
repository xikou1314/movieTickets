import {sequelize} from '../../model/index';
  
  export default async (ctx, next) => {
    var responseData={
      code:1,
      msg:"查询影厅座位信息失败"
    };
    console.log("查询座位信息");
    //查询影厅基本信息
    await sequelize.query(`SELECT * FROM seatinfo WHERE roomId=${ctx.query.roomId} AND deletedAt is null`).then(res=>{
      console.log(res);
      if(res[0].length>0)
      {
          responseData={
          code:0,
          msg:'查询影厅座位信息成功',
          data:res[0]
        };
      }
  
    });
    ctx.body=responseData;
  }

