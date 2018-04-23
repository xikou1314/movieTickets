import {sequelize} from '../../model/index';
  
  export default async (ctx, next) => {
    var responseData={
      code:0,
      msg:"查询用户订单列表失败"
    };
    //
    console.log(ctx.request.query);
    await sequelize.query("SELECT * FROM booking,arrange,film,filmroom,seatinfo,posterimg WHERE film.filmId=posterimg.filmId AND booking.arrangeId=arrange.arrangeId AND booking.filmId=film.filmId AND booking.roomId=filmroom.roomId AND booking.seatId=seatinfo.seatId AND booking.userId=? ORDER BY booking.id DESC",{
      replacements:[ctx.request.query.userId]
    }).then(result=>{
      if(result[0].length>0)
      {
        responseData={
          code:1,
          msg:"查询用户订单列表成功",
          data:result[0]
        };
      }
    })
    ctx.response.body=responseData;
  }

