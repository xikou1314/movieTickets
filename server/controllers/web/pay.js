import {sequelize} from '../../model/index';

  export default async (ctx, next) => {
    var responseData={
      code:0,
      msg:"创建订单失败"
    };
    var date=new Date();
    const {arrangeId,userId,seats,filmId,roomId}=ctx.request.body; 
    console.log(ctx.request.body);
    var sql="INSERT INTO booking VALUES";
    var params=[];
    for(var i of seats)
    {
      sql+="(null,?,?,?,?,?,?,?,?,?,null),"
      params.push(arrangeId);
      params.push(userId);
      params.push(i.seatId);
      params.push(filmId);
      params.push(roomId);
      params.push(Math.random()*900000|100000);
      params.push("已付款");
      params.push(date);
      params.push(date);
    }
    await sequelize.query(sql.slice(0,-1),{
      replacements:params
    }).then(result=>{
      if(result[1]>0)
      {
        responseData={
          code:1,
          msg:"创建订单成功"
        };
      }
    });
    ctx.body = responseData;

  }

