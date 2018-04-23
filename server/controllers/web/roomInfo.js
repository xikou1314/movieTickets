import {sequelize} from '../../model/index';
  
  export default async (ctx, next) => {
    var responseData={
      code:0,
      msg:"查询影厅基本信息失败"
    };
    //根据场次id 查询filmroom表 将影厅的基本信息取出 查询订单表查询是否有已定的座位
    await sequelize.query("SELECT * FROM arrange,filmroom WHERE arrange.roomId=filmroom.roomId AND arrangeId=?",{
      replacements:[ctx.request.query.arrangeId]
    }).then(result=>{

      responseData={
        code:1,
        msg:"查询影厅基本信息成功",
        data:result[0]
      }
    });
    ctx.body=responseData;
  }

