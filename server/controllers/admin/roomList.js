import {sequelize} from '../../model/index';

  export default async (ctx, next) => {
    let responseData={
      code:0,
      msg:'查询影厅列表失败'
  };

    let search="";
    if(ctx.request.query.roomName || ctx.request.query.roomId)
    {
      for(var i in ctx.request.query)
      {
        switch(i)
        {
          case "roomName":
                search+=' AND roomName LIKE "%'+ctx.request.query[i]+'%" ';
                break;
          case "roomId":
                search+=' AND roomId LIKE "%'+ctx.request.query[i]+'%" ';
                break;
        }
      }
      await sequelize.query("SELECT * FROM filmroom WHERE "+search.slice(4)+' AND deletedAt is null').then(res=>{
        if(res[0].length>0)
        {
          responseData={
            code:1,
            msg:'获取影厅列表成功',
            data:res[0]
          }
        }
      })
    }
    else{
      await sequelize.query("SELECT * FROM filmroom WHERE  deletedAt is null").then(res=>{
        if(res[0].length>0)
        {
          responseData={
            code:1,
            msg:'获取影厅列表成功',
            data:res[0]
          }
        }
      })
    }


    ctx.body=responseData;
  }
   


