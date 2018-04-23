import {sequelize} from '../../model/index';

  export default async (ctx, next) => {
    let responseData={
      code:0,
      msg:'创建电影厅失败'
  };
   
    let requestData=ctx.request.body;
    let {roomName,number,row,column,seats} = ctx.request.body;
    console.log(ctx.request.body);
    //向filmRoom表中插入 影厅基本信息
    let date=new Date();
    let roomId=-1;
    await sequelize.query('INSERT INTO filmroom VALUES (null,?,?,?,?,?,?,null)',{
      replacements:[roomName,number,row,column,date,date]
    }).then(res=>{
      roomId=res[0];
    })

    //向座位信息表中加入影厅座位信息
    if(roomId!==-1)
    {
      //构造插入语句
      let sql="INSERT INTO seatinfo VALUES ";
      let replacements=[];
      for(var i of seats)
      {
        sql+="(null,?,?,?,?,?,?,null),"
        replacements=replacements.concat([roomId,i.code,i.row,i.column,date,date]);
      }
      await sequelize.query(sql.slice(0,-1)+";",{
        replacements:replacements
      }).then(res=>{
        console.log(res);
        if(res[1]>0)
        {
          responseData={
            code:1,
            msg:'创建电影厅成功'
        };
        }
      })
    }
 

  

    ctx.body=responseData;


  
    

    
  }
   


