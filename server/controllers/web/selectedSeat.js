import {sequelize} from '../../model/index';

  export default async (ctx, next) => {
    var responseData={
      code:0,
      msg:"查询已选中的座位失败"
    };
    await sequelize.query("SELECT * FROM booking,seatinfo WHERE booking.seatId=seatinfo.seatId AND arrangeId=?",{
      replacements:[ctx.request.query.arrangeId]
    }).then(result=>{
      if(result[0].length>0){
        responseData={
          code:1,
          msg:"查询已选中的座位成功",
          data:result[0]
        };
      }
    }).catch(err=>{
      console.log(err);
    })
    ctx.body = responseData;

  }

