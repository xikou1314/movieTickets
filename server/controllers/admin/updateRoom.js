import {sequelize} from '../../model/index';

  export default async (ctx, next) => {
    let responseData={
      code:0,
      msg:'修改电影厅失败'
  };
   
    let requestData=ctx.request.body;
    let {roomName,number,row,column,seats,roomId} = ctx.request.body;
    console.log(seats);
    //修改filmRoom的基本信息
    let date=new Date();
    await sequelize.query("UPDATE filmroom SET roomName=?,number=?,row=?,filmroom.column=?,updatedAt=? WHERE roomId=?",{
      replacements:[roomName,number,row,column,date,roomId]
    });
    //更新座位信息
    //先删除所有旧的座位信息
    
    await sequelize.query("UPDATE seatinfo SET deletedAt=? WHERE roomId=?  AND deletedAt is null",{
      replacements:[date,roomId]
    });

    //插入新的座位信息

    //构造插入语句
    let sql="INSERT INTO seatinfo VALUES ";
    let replacements=[];
    for(var i in seats)
    {
      sql+="(null,?,?,?,?,?,?,null),"
      replacements=replacements.concat([roomId,seats[i].code,seats[i].row,seats[i].column,date,date]);
    }
    await sequelize.query(sql.slice(0,-1)+";",{
      replacements:replacements
    }).then(res=>{
      if(res[1]>0)
      {
        responseData={
          code:1,
          msg:'修改电影厅成功'
      };
      }
    })
    ctx.body=responseData;

  }
   


